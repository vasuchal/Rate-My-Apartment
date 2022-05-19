import { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  UnorderedList,
  useToast,
  Link,
  ListItem,
} from '@chakra-ui/react';
import { Link as ReactLink, useNavigate } from 'react-router-dom';

import { SearchIcon } from '@chakra-ui/icons';
import { getApartmentsByName } from '../utils/apiWrapper';
import { useAuth } from '../contexts/AuthContext';

export const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [apartments, setApartments] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  const toast = useToast({
    position: 'bottom-right',
  });

  const searchApartment = async (name) => {
    const res = await getApartmentsByName(name).catch((error) => ({
      ...error.response,
    }));

    // console.log(res);

    if (res.status && res.status >= 400 && res.status < 500) {
      toast({
        title: 'Error',
        description: res.statusText,
        status: 'error',
      });
      return;
    }
    // console.log(res.data);
    setApartments(res.data.results);
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      searchApartment(search);
    }
  };

  if (!user.ResidentId) {
    return <Heading>Not Logged in</Heading>
  }

  return (
    <main>
      <Box width={['90%', '70%', '60%']} m="auto" mt="25vh">
        <Heading size="lg">Search for Apartments</Heading>
        <InputGroup size="lg" mt={5}>
          <InputLeftElement children={<SearchIcon />} />
          <Input
            onKeyPress={handleSearch}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Gather Illinois"
            variant="outline"
            border="solid blue 2px"
          />
        </InputGroup>
      </Box>
      {/* {console.log(apartments.length)} */}
      {apartments.length > 0 && (
        <UnorderedList marginLeft="20%" width="60%" mt={5} listStyleType="none">
          {apartments &&
            apartments.map((apartment) => (
              <ListItem
                _hover={{ transform: 'translate(0, -2px)', bg: 'gray.300' }}
                borderRadius={5}
                p={5}
                bg="gray.200"
                marginBottom="5px"
              >
                <Link
                  variant="search-results"
                  as={ReactLink}
                  to={`/apartments/${apartment.ApartmentId}`}
                  color="black"
                >
                  <li style={{ listStyle: 'none' }} key={apartment.ApartmentId}>
                    {apartment.ApartmentName}
                  </li>
                </Link>
              </ListItem>
            ))}
        </UnorderedList>
      )}
    </main>
  );
};
