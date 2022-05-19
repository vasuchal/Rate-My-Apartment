import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Heading, Text, Flex } from '@chakra-ui/react';

export const ApartmentDescription = ({ apartmentInfo }) => {
  // NOTE: for future it would be cool if we let user's set price ranges for what they consider each category to be (better formula)
  // TODO: make it so that if score is 0, it's either N.A or valid zero like apt sucks
  // TODO: Implement tiny diamonds or square icons as separators instead of "||"
  // TODO: add min width, blue boxes shouldn't depend on size of text title
  const determineRange = (average) => {
    if (average < 500) {
      return '$';
    } else if (average >= 500 && average <= 700) {
      return '$$';
    } else {
      return '$$$';
    }
  };

  const evaluateColor = (average) => {
    if (average < 500) {
      return 'tomato';
    } else if (average >= 500 && average <= 700) {
      return '#AEAF52';
    } else {
      return '#1C7329';
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Heading fontSize="6xl">
            {apartmentInfo && apartmentInfo.ApartmentName}{' '}
          </Heading>
          <Text
            p={5}
            fontSize="5xl"
            fontWeight={'bold'}
            color={evaluateColor(
              (apartmentInfo.MinPrice + apartmentInfo.MaxPrice) / 2,
            )}
          >
            {determineRange(
              (apartmentInfo.MinPrice + apartmentInfo.MaxPrice) / 2,
            )}
          </Text>
        </div>
        <Text fontSize="2xl">{`${apartmentInfo.ManagementName} || ${
          apartmentInfo.ApartmentName
        } ${apartmentInfo.City}, ${apartmentInfo.State} ${
          apartmentInfo.ZipCode
        } || ${apartmentInfo.Has1Br ? '1br' : ''} ${
          apartmentInfo.Has2Br ? '2br' : ''
        } ${apartmentInfo.Has3Br ? '3br' : ''} ${
          apartmentInfo.Has3Br || apartmentInfo.Has2Br || apartmentInfo.Has1Br
            ? '||'
            : ''
        } $${apartmentInfo.MinPrice} - $${apartmentInfo.MaxPrice}`}</Text>
      </div>
    </div>
  );
};
