import {
  useDisclosure,
  Modal,
  Button,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  Select,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const NewApartmentModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const initialRef = useRef();
  const finalRef = useRef();

  const createApartment = () => {
    navigate('/apartments/0');
  };

  return (
    <Fragment>
      <Button onClick={onOpen} colorScheme="telegram" leftIcon={<AddIcon />}>
        Add Apartment
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create an apartment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input ref={initialRef} placeholder="Gather Illinois..." />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Management</FormLabel>
              <Select placeholder="Select a management">
                <option>Management 1</option>
                <option>Management 2</option>
                <option>Management 3</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={createApartment} colorScheme="blue" mr={3}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};
