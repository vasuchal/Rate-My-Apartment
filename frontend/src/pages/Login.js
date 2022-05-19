import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  chakra,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { EyeIcon, EyeOffIcon } from 'chakra-ui-ionicons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sha from 'js-sha256';

import { loginUser } from '../utils/apiWrapper';
import { useAuth } from '../contexts/AuthContext';
import { NewUser } from '../components';

// A login page for the aparmtnet website
export const LoginPage = () => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [rawPassword, setRawPassword] = useState('');

  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogin = () => {
    const sendLogin = async () => {
      const res = await loginUser({
        email,
        password: sha(rawPassword),
      }).catch(({ status, err }) => {
        return {
          status,
          err,
        };
      });

      setIsLoading(false);

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
        navigate('/search');
      } else {
        toast({
          position: 'bottom-right',
          title: 'Error',
          description: 'Failed to login',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    setIsLoading(true);
    sendLogin();
  };

  return (
    <main>
      <Box
        justifyContent="center"
        alignItems="center"
        w="100vw"
        minH="100vh"
        maxH="100vh"
      >
        <Flex
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          height="300px"
          bg="base"
        >
          <Heading as="h1" fontSize="4xl" color="white">
            Rate My Apartment
          </Heading>
        </Flex>
        <Box width={['90%', '70%', '60%']} m="auto" p={10} bg="white">
          <Flex>
            <Box width="100%">
              <Heading mt={5} mb={5} size="lg">
                User Login
              </Heading>
              <chakra.label htmlFor="email">Email</chakra.label>
              <Input
                autoComplete="off"
                onChange={(e) => setEmail(e.currentTarget.value)}
                id="email"
              />
              <chakra.label htmlFor="password">Password</chakra.label>
              <InputGroup>
                <Input
                  onChange={(e) => setRawPassword(e.currentTarget.value)}
                  id="password"
                  type={showLoginPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                />
                <InputRightElement>
                  <IconButton
                    _hover={{ bg: 'transparent' }}
                    bg={'transparent'}
                    onClick={() => setShowLoginPassword((show) => !show)}
                  >
                    {showLoginPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </IconButton>
                </InputRightElement>
              </InputGroup>
              <Button
                onClick={handleLogin}
                width="100%"
                mt={5}
                bg="base"
                color="white"
                _hover={{ backgroundColor: 'base' }}
                disabled={isLoading}
              >
                Login
              </Button>
            </Box>
          </Flex>

          <Divider m="20px 0px 20px 0px" />

          <Box textAlign="center">
            <Heading size="sm" m={5}>
              Or
            </Heading>
            <Button
              onClick={handleLogin}
              color="white"
              bg="red.400"
              _hover={{ backgroundColor: 'red.500' }}
            >
              Sign In With Google
            </Button>
            <NewUser />
          </Box>
        </Box>
      </Box>
    </main>
  );
};
