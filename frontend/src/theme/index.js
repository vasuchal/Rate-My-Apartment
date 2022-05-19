import { extendTheme } from '@chakra-ui/react';

import { Colors } from './colors';
import { Components } from './components';

const theme = extendTheme({
  initialColorMode: 'dark',
  colors: Colors,
  components: Components,
});

export default theme;
