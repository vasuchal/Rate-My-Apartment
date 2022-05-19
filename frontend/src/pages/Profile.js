import { Box, Button, Heading, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../utils/apiWrapper';

const EmptyProfilePicture = () => (
  <Box
    as="img"
    src="http://multiversitystatic.s3.amazonaws.com/uploads/2019/06/Avatar-the-Last-Airbender-3.13-The-Firebending-Masters-950x700.jpg"
    alt="Profile Picture"
    height="220px"
    width="240px"
    mx="auto"
    mb="10px"
    borderRadius="50%"
  />
);

export const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logoutUser();

    if (res.status === 204) {
      navigate('/login');
    }
  };

  if (!user.ResidentId) {
    return <Heading>Not Logged in</Heading>
  }
  

  return (
    <main>
      <Box
        bg="#F6F6F6"
        m="auto"
        width={['90%', '70%', '55%']}
        padding="35px 0px"
        border="solid 1px #E2E2E2"
        mt="25vh"
        textAlign="center"
      >
        {user.ProfilePicture ? (
          <Image
            src={user.ProfilePicture}
            alt="Profile Picture"
            size="200px"
            mx="auto"
            mb="10px"
          />
        ) : (
          <EmptyProfilePicture />
        )}
        <Heading size="lg">{`${user.FirstName} ${user.LastName}`}</Heading>
        <Text>{user.Email}</Text>

        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </main>
  );
};
