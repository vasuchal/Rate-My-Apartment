import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Text, Flex, useColorMode } from '@chakra-ui/react';

export const ApartmentAmenities = ({ apartmentInfo }) => {
  const { colorMode } = useColorMode();

  return (
    <div>
      <div
        style={{
          marginTop: '2%',
          display: 'flex',
          justifyContent: 'space-between',
          width: '600px',
        }}
      >
        <Flex
          alignItems={'center'}
          backgroundColor={'telegram.200'}
          // color="white"
          p={1.5}
        >
          <Text color="#1A202C" mr={'25px'} fontWeight={'medium'}>
            Bus Stop
          </Text>
          {apartmentInfo.BusStop ? (
            <CheckIcon color="#10B8E0" fontSize={'md'} mr={'5px'} />
          ) : (
            <CloseIcon color="#EC5C42" fontSize={'md'} mr={'5px'} />
          )}
        </Flex>
        <Flex
          alignItems={'center'}
          backgroundColor={'telegram.200'}
          color="white"
          p={1.5}
        >
          <Text color="#1A202C" mr={'25px'} fontWeight={'medium'}>
            Gym
          </Text>
          {apartmentInfo.Gym ? (
            <CheckIcon color="#10B8E0" fontSize={'md'} mr={'5px'} />
          ) : (
            <CloseIcon color="#EC5C42" fontSize={'md'} mr={'5px'} />
          )}
        </Flex>
        <Flex
          alignItems={'center'}
          backgroundColor={'telegram.200'}
          color="white"
          p={1.5}
        >
          <Text color="#1A202C" mr={'25px'} fontWeight={'medium'}>
            6 Month Lease
          </Text>
          {apartmentInfo['6MonthLease'] ? (
            <CheckIcon color="#37B34A" fontSize={'md'} mr={'5px'} />
          ) : (
            <CloseIcon color="#EC5C42" fontSize={'md'} mr={'5px'} />
          )}
        </Flex>
        <Flex
          alignItems={'center'}
          backgroundColor={'telegram.200'}
          // color="white"
          p={1.5}
        >
          <Text color="#1A202C" mr={'25px'} fontWeight={'medium'}>
            12 Month Lease
          </Text>
          {apartmentInfo['12MonthLease'] ? (
            <CheckIcon color="#37B34A" fontSize={'md'} mr={'5px'} />
          ) : (
            <CloseIcon color="#EC5C42" fontSize={'md'} mr={'5px'} />
          )}
        </Flex>
      </div>
    </div>
  );
};
