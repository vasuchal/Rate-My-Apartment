import { useEffect, useState } from 'react';
import {
  Box,
  Checkbox,
  Flex,
  Input,
  InputGroup,
  Link,
  ListItem,
  Select,
  SimpleGrid,
  Text,
  UnorderedList,
  useToast,
  chakra,
  Heading,
} from '@chakra-ui/react';
import { MinusIcon } from '@chakra-ui/icons';

import { getAllApartments, loadTopManagementRating } from '../utils/apiWrapper';

import { NewApartmentModal } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { useManagements } from '../contexts/ManagementContext';
import { useNavigate } from 'react-router-dom';

export const ApartmentsPage = () => {
  const [apartments, setApartments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [aptCount, setAptCount] = useState(10);
  const [selectedManagement, setSelectedManagement] = useState();
  const [has1Br, setHas1Br] = useState(false);
  const [has2Br, setHas2Br] = useState(false);
  const [has3Br, setHas3Br] = useState(false);
  const [hasBus, setHasBus] = useState(false);
  const [hasGym, setHasGym] = useState(false);
  const [hasHalfYearLease, setHasHalfYearLease] = useState(false);
  const [hasFullYearLease, setHasFullYearLease] = useState(false);

  const [topRating, setTopRating] = useState();

  const navigate = useNavigate();
  const { user } = useAuth();

  const toast = useToast();

  const managements = useManagements();

  useEffect(() => {
    const getApartments = async () => {
      const res = await getAllApartments({
        limit: aptCount,
        offset: page - 1,
        ManagementName: selectedManagement,
        Has1Br: has1Br ? 'TRUE' : undefined,
        Has2Br: has2Br ? 'TRUE' : undefined,
        has3Br: has3Br ? 'TRUE' : undefined,
        Gym: hasGym ? 'TRUE' : undefined,
        BusStop: hasBus ? 'TRUE' : undefined,
        '6MonthLease': hasHalfYearLease ? 'TRUE' : undefined,
        '12MonthLease': hasFullYearLease ? 'TRUE' : undefined,
      }).catch((error) => ({
        ...error.response,
      }));

      if (res.status && res.status >= 400 && res.status < 500) {
        toast({
          title: 'Error',
          description: res.statusText,
          status: 'error',
          position: 'bottom-right',
          isClosable: true,
        });
        return;
      }

      setTotalCount(res.data.count);
      setApartments(res.data.results);
    };

    getApartments();
  }, [
    toast,
    aptCount,
    page,
    selectedManagement,
    has1Br,
    has2Br,
    has3Br,
    hasBus,
    hasGym,
    hasHalfYearLease,
    hasFullYearLease,
  ]);

  useEffect(() => {
    const loadTop = async () => {
      const res = await loadTopManagementRating();

      setTopRating(res.data.data[0][0].grop);
    }

    loadTop();
  }, []);

  if (!user.ResidentId) {
    return <Heading>Not Logged in</Heading>
  }

  return (
    <main>
      <Flex>
        <aside>
          <Box
            p={5}
            width="300px"
            backgroundColor="gray.200"
            minH={'calc(100vh - 60px)'}
            color="black"
          >
            <UnorderedList ml="0" listStyleType="none">
              <Box mb={6} key="bedrooms filter">
                <Heading size="md">Number of Bedrooms</Heading>
                <UnorderedList mt={4} listStyleType="none">
                  <ListItem>
                    <Checkbox
                      onChange={(e) => setHas1Br(e.currentTarget.checked)}
                    >
                      1 Bedroom
                    </Checkbox>
                  </ListItem>
                  <ListItem>
                    <Checkbox
                      onChange={(e) => setHas2Br(e.currentTarget.checked)}
                    >
                      2 Bedroom
                    </Checkbox>
                  </ListItem>
                  <ListItem>
                    <Checkbox
                      onChange={(e) => setHas3Br(e.currentTarget.checked)}
                    >
                      3 Bedroom
                    </Checkbox>
                  </ListItem>
                </UnorderedList>
              </Box>
              <Box mb={6} key="price range filter">
                <Heading size="md">Price Range</Heading>
                <InputGroup mt={4} alignItems="center">
                  <Input
                    bg="white"
                    variant="outline"
                    type="number"
                    placeholder="Min"
                    _placeholder={{ color: 'gray.400' }}
                  />
                  <MinusIcon m="0px 6px 0px 6px" />
                  <Input
                    bg="white"
                    variant="outline"
                    type="number"
                    placeholder="Max"
                    _placeholder={{ color: 'gray.400' }}
                  />
                </InputGroup>
              </Box>
              <Box mb={6} key="management filter">
                <Heading size="md">Management</Heading>
                <Select
                  onChange={(e) => setSelectedManagement(e.currentTarget.value)}
                  bg="white"
                  placeholder="Select Management"
                  mt={4}
                >
                  {managements &&
                    managements.map((management) => (
                      <option key={management.Name} value={management.Name}>
                        {management.Name}
                      </option>
                    ))}
                </Select>
              </Box>
              <Box mb={6} key="amenenties filter">
                <Heading size="md">Amenenties</Heading>
                <UnorderedList mt={4} listStyleType="none">
                  <ListItem>
                    <Checkbox
                      onChange={(e) => setHasBus(e.currentTarget.checked)}
                    >
                      Bus stop
                    </Checkbox>
                  </ListItem>
                  <ListItem>
                    <Checkbox
                      onChange={(e) => setHasGym(e.currentTarget.checked)}
                    >
                      Gym
                    </Checkbox>
                  </ListItem>
                </UnorderedList>
              </Box>
              <Box mb={6} key="lease filter">
                <Heading size="md">Leases</Heading>
                <UnorderedList mt={4} listStyleType="none">
                  <ListItem>
                    <Checkbox
                      onChange={(e) =>
                        setHasHalfYearLease(e.currentTarget.checked)
                      }
                    >
                      6 Month
                    </Checkbox>
                  </ListItem>
                  <ListItem>
                    <Checkbox
                      onChange={(e) =>
                        setHasFullYearLease(e.currentTarget.checked)
                      }
                    >
                      12 Month
                    </Checkbox>
                  </ListItem>
                </UnorderedList>
              </Box>
            </UnorderedList>
          </Box>
        </aside>
        <Box w={'100%'} maxH={'calc(100vh - 60px)'} p={10} overflow="auto">
          <Box padding="10px">
            <Heading size="lg">Top Management Grade</Heading>
            <pre>
              {/* {JSON.stringify(topRating).includes('ER_SP_DOES_NOT_EXIST') ? (
                <Text>Bronze at best</Text>
              ) : (
                topRating
              )}
               */}
               {JSON.stringify(topRating)}
            </pre>

          </Box>
          <Flex>
            <Box flexGrow={1}>
              <NewApartmentModal />
            </Box>
            <Flex mr={5} alignItems="center">
              <Text width="150px"> Total count: {totalCount} </Text>
              <chakra.label mr={4} htmlFor="page">
                Page:{' '}
              </chakra.label>
              <Input
                id="page"
                type="number"
                value={page}
                onChange={(e) => setPage(e.currentTarget.value || 1)}
                width="50px"
              />
            </Flex>
            <Select
              defaultValue={aptCount}
              onChange={(e) => setAptCount(e.currentTarget.value)}
              width="100px"
              bg="white"
              color="black"
            >
              <option>10</option>
              <option>50</option>
              <option>100</option>
            </Select>
          </Flex>

          <SimpleGrid position="relative" mt={5} columns={3} spacing={10}>
            {apartments &&
              apartments.map((apartment) => (
                <Link
                  _hover={{ transform: 'translate(0, -2px)', bg: 'gray.300' }}
                  href={`/apartments/${apartment.ApartmentId}`}
                  borderRadius={5}
                  p={5}
                  bg="gray.200"
                  key={apartment.ApartmentId}
                  color={'black'}
                >
                  <Heading size="sm">{apartment.ApartmentName}</Heading>
                  <Text fontSize="13px">
                    Management: {apartment.ManagementName}
                  </Text>
                  <Text fontSize="13px">
                    Location: {apartment.City}, {apartment.State}
                  </Text>
                </Link>
              ))}
          </SimpleGrid>
        </Box>
      </Flex>
    </main>
  );
};
