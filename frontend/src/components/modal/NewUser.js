import React, { useEffect, useState } from 'react';
import {
  Modal,
  chakra,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
  useToast,
} from '@chakra-ui/react';
import { EyeOffIcon, EyeIcon } from 'chakra-ui-ionicons';
import { createUser, getAllApartments } from '../../utils/apiWrapper';
import { useNavigate } from 'react-router-dom';
import sha from 'js-sha256';

export const NewUser = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [email, setEmail] = React.useState('');
  const [rawPassword, setRawPassword] = React.useState('');
  const [showCreatePassword, setShowCreatePassword] = React.useState(false);
  const [apartmentId, setApartmentId] = useState();
  const [apartmentList, setApartmentList] = useState();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const loadApartments = async () => {
      const res = await getAllApartments().catch(({ status, err }) => {
        return {
          status,
          err,
        };
      });

      if (res.status === 500 || res.status === 401) {
        toast({
          title: 'Error',
          description: 'Could not load apartments',
          status: 'error',
        });

        return;
      }

      const list = res.data.results.map((apartment) => (
        <option key={apartment.ApartmentId} value={apartment.ApartmentId}>
          {apartment.ApartmentName}
        </option>
      ));

      setApartmentId(
        res.data.results.length > 0
          ? res.data.results[0].ApartmentId
          : undefined,
      );

      setApartmentList(list);
    };

    loadApartments();
  }, []);

  const handleCreate = () => {
    const sendCreate = async () => {
      const res = await createUser({
        email: email,
        password: sha(rawPassword),
        apartmentId,
        firstName,
        lastName,
      }).catch(({ status, err }) => {
        return {
          status,
          err,
        };
      });

      if (res.status === 500) {
        toast({
          position: 'bottom-right',
          title: 'Error',
          description: 'Server is not turned on',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      if (res.status === 200) {
        navigate('/profile');
      } else {
        toast({
          position: 'bottom-right',
          title: 'Error',
          description: 'Failed to create user',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    sendCreate();
  };

  return (
    <>
      <Button
        ml={10}
        color="white"
        bg="base"
        _hover={{ backgroundColor: 'base' }}
        onClick={onOpen}
      >
        Sign up
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <chakra.label htmlFor="new-email">New Email</chakra.label>
              <Input
                autoComplete="off"
                onChange={(e) => setEmail(e.currentTarget.value)}
                id="new-email"
              />
              <chakra.label htmlFor="new-password">New Password</chakra.label>
              <InputGroup>
                <Input
                  onChange={(e) => setRawPassword(e.currentTarget.value)}
                  id="new-password"
                  type={showCreatePassword ? 'text' : 'password'}
                  autoComplete="new-password"
                />
                <InputRightElement>
                  <IconButton
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    bg={'transparent'}
                    _hover={{ bg: 'transparent' }}
                  >
                    {showCreatePassword ? <EyeOffIcon /> : <EyeIcon />}
                  </IconButton>
                </InputRightElement>
              </InputGroup>
              <chakra.label id="firstName" htmlFor="firstName">
                First Name
              </chakra.label>
              <Input
                onChange={(e) => setFirstName(e.currentTarget.value)}
                id="firstName"
              />
              <chakra.label id="lastName" htmlFor="lastName">
                Last Name
              </chakra.label>
              <Input
                onChange={(e) => setLastName(e.currentTarget.value)}
                id="lastName"
              />
              <chakra.label id="apartment">Apartment</chakra.label>
              <Select onChange={(e) => setApartmentId(e.currentTarget.value)}>
                {apartmentList}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleCreate} colorScheme="green" variant="solid">
              Sign up
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
