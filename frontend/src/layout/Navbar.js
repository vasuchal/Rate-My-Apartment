import React from 'react';
import {
  UnorderedList,
  ListItem,
  Link,
  chakra,
  Flex,
  Button,
  useColorMode,
} from '@chakra-ui/react';
import { MoonIcon } from '@chakra-ui/icons';
import { SunnySharpIcon } from 'chakra-ui-ionicons';

function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <header>
      <Button
        bg="transparent"
        _hover={{ bg: 'transparent' }}
        onClick={toggleColorMode}
      >
        {/* Toggle {colorMode === 'light' ? 'Dark' : 'Light'} */}
        {colorMode === 'light' ? <MoonIcon /> : <SunnySharpIcon />}
      </Button>
    </header>
  );
}

// Chakra UI navbar for the application
export const Navbar = () => (
  <chakra.nav m={0} p={0}>
    <UnorderedList
      color="white"
      backgroundColor="base"
      listStyleType="none"
      m={0}
      height="60px"
      p={5}
      display="flex"
      alignItems="center"
    >
      <ListItem>Rate my Apartment</ListItem>
      <Flex alignItems={'center'} justifyContent="right" flexGrow="1">
        <ListItem mr={5}>
          <Link href="/search">Search</Link>
        </ListItem>
        <ListItem mr={5}>
          <Link href="/apartments">Apartments</Link>
        </ListItem>
        <ListItem mr={5}>
          <Link href="/profile">Profile</Link>
        </ListItem>
        <ListItem mr={5}>
          <Link href="/login">Login</Link>
        </ListItem>
        <ListItem>
          <ToggleDarkMode />
        </ListItem>
      </Flex>
    </UnorderedList>
  </chakra.nav>
);

export default Navbar;
