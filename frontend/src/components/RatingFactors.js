import { Heading, Progress, Text, Box } from '@chakra-ui/react';

// TODO: make this sticky
export const RatingFactors = ({ reviewInfo, managementScore }) => {
  // Get green, yellow, red color scheme based on decimal score from 1 to 5
  const getColor = (score) => {
    console.log(score);
    if (score >= 4) {
      return 'green';
    } else if (score >= 2.5) {
      return 'yellow';
    } else {
      return 'red';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#EEE8E8',
        // padding: '50px 50px 50px 50px',
        alignItems: 'center',
        marginTop: '53%',
        border: '4px black',
        borderBottomStyle: 'outset',
        borderRightStyle: 'outset',
        color: 'black',
      }}
    >
      <Box p={5}>
        <Heading fontSize="4xl" style={{ paddingBottom: '10%' }}>
          Rating Factors
        </Heading>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '50px',
          }}
        >
          <div style={{ marginRight: '3%' }}>
            <Text fontSize="2xl">Management</Text>
          </div>
          <div>
            <Progress
              colorScheme={getColor(managementScore)}
              backgroundColor={'#08335A'}
              width="200px"
              height="25px"
              value={managementScore * 20}
              style={{ boxShadow: '1px 3px 5px black' }}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '50px',
          }}
        >
          <div style={{ marginRight: '3%' }}>
            <Text fontSize="2xl">Noise</Text>
          </div>
          <div>
            <Progress
              colorScheme={getColor(reviewInfo.NoiseAvgScore)}
              backgroundColor={'#08335A'}
              width="200px"
              height="25px"
              value={reviewInfo.NoiseAvgScore * 20}
              style={{ boxShadow: '1px 3px 5px black' }}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '50px',
          }}
        >
          <div style={{ marginRight: '3%' }}>
            <Text fontSize="2xl">Location</Text>
          </div>
          <Progress
            colorScheme={getColor(reviewInfo.LocationAvgScore)}
            backgroundColor={'#08335A'}
            width="200px"
            height="25px"
            value={reviewInfo.LocationAvgScore * 20}
            style={{ boxShadow: '1px 3px 5px black' }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '50px',
          }}
        >
          <div style={{ marginRight: '3%' }}>
            <Text fontSize="2xl">Wifi</Text>
          </div>
          <div>
            <Progress
              colorScheme={getColor(reviewInfo.WifiAvgScore)}
              backgroundColor={'#08335A'}
              width="200px"
              height="25px"
              value={reviewInfo.WifiAvgScore * 20}
              style={{ boxShadow: '1px 3px 5px black' }}
            />
          </div>
        </div>
      </Box>
    </div>
  );
};
