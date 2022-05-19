import { Box, Text, useColorMode } from '@chakra-ui/react';

export const ScoreBox = ({ score, textSize }) => {
  const { colorMode } = useColorMode();

  const evaluateColor = (score) => {
    if (score < 1.5) {
      return '#FEB2B2';
    } else if (score >= 1.5 && score <= 3.5) {
      return '#FAF089';
    } else {
      return '#9AE6B4';
    }
  };

  const evaluateLightModeColor = (score) => {
    if (score < 1.5) {
      return '#E53E3E';
    } else if (score >= 1.5 && score <= 3.5) {
      return '#D69E2E';
    } else {
      return '#38A169';
    }
  };

  return (
    <div>
      <Box
        backgroundColor={
          colorMode === 'dark'
            ? evaluateColor(score)
            : evaluateLightModeColor(score)
        }
        style={{
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '1rem',
        }}
        p={4}
        // color="white"
        // color={evaluateColor(score)}
        color="black"
        fontSize={textSize}
      >
        <Text color={colorMode === 'light' && 'white'} fontWeight={'medium'}>
          {Number(score).toFixed(1)}
        </Text>
      </Box>
    </div>
  );
};
