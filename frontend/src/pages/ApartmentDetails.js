import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getApartmentById,
  getCommentsForApartment,
  getReviewForApartment,
  getManagementScore,
  getResidentCommentsForApartment,
} from '../utils/apiWrapper';
import { useToast, Flex, Box, chakra, 
  Heading } from '@chakra-ui/react';
import Select from 'react-select';
import { RatingFactors } from '../components/RatingFactors';
import { ScoreBox } from '../components/ScoreBox';
import { ApartmentDescription } from '../components/ApartmentDescription';
import { Comment } from '../components/Comment';
import { RatingModal } from '../components/modal/NewRating';
import { ApartmentAmenities } from '../components/ApartmentAmenities';
import { useAuth } from '../contexts/AuthContext';

export const ApartmentDetailsPage = () => {
  const params = useParams();
  const toast = useToast();
  const [apartmentInfo, setApartmentInfo] = useState({});
  const [comments, setComments] = useState([]);
  const [reviewInfo, setReviewInfo] = useState({});
  const [managementScore, setManagementScore] = useState(0);
  const [filter, setFilter] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  // TODO: implement likes filtering, highest + lowest scores
  // TODO: Make everything sticky except components
  // TODO: Add things where we show count in the SELECT BAR (Ex: Show All (10))

  const options = [
    {
      label: <chakra.label style={{ color: 'gray' }}>Show all</chakra.label>,
      value: 'def',
    },
    {
      label: (
        <chakra.label
          _active={{ bg: 'none' }}
          _focus={{ color: 'white' }}
          style={{ color: 'gray' }}
        >
          Filter By Current Residents
        </chakra.label>
      ),
      value: 'res',
    },
  ];

  // TODO: Add filter functionality, add delete and edit comment buttons
  useEffect(() => {
    const getApartmentInfo = async () => {
      const res = await getApartmentById(params.id).catch((error) => ({
        ...error.response,
      }));

      // console.log(res); // TODO: take this out

      if (res.status && res.status >= 400 && res.status < 500) {
        toast({
          title: 'Error',
          description: res.statusText,
          status: 'error',
        });
        return;
      }
      setApartmentInfo(res.data[0]);

      const res2 = await getManagementScore(
        res.data[0] && res.data[0].ManagementName,
      );
      if (res2.status && res2.status >= 400 && res2.status < 500) {
        toast({
          title: 'Error',
          description: res2.statusText,
          status: 'error',
        });
        return;
      }
      setManagementScore(res2.data[0]['MgmtAvgScore']);
    };
    getApartmentInfo();

    const getComments = async () => {
      const res = await getCommentsForApartment(params.id).catch((error) => ({
        ...error.response,
      }));

      // console.log(res); // TODO: take this out

      if (res.status && res.status >= 400 && res.status < 500) {
        toast({
          title: 'Error',
          description: res.statusText,
          status: 'error',
        });
        return;
      }
      setComments(res.data);
    };
    getComments();

    const getReviewInfo = async () => {
      const res = await getReviewForApartment(params.id).catch((error) => ({
        ...error.response,
      }));

      console.log(res); // TODO: take this out

      if (res.status && res.status >= 400 && res.status < 500) {
        toast({
          title: 'Error',
          description: res.statusText,
          status: 'error',
        });
        return;
      }
      setReviewInfo(res.data[0]);
    };
    getReviewInfo();
  }, [params.id, toast, trigger]);

  const onDelete = (commentId) => {
    setComments((comments) =>
      comments.filter((comment) => comment.CommentId !== commentId),
    );

    setTrigger((currTrigger) => !currTrigger);
  };

  const cb = () => setTrigger((currTrigger) => !currTrigger);

  const handleFilterChange = async (e) => {
    setFilter(e);
    if (e.value === 'res') {
      const res = await getResidentCommentsForApartment(params.id).catch(
        (error) => ({
          ...error.response,
        }),
      );
      // console.log(res.data);
      setComments(res.data);
    } else {
      const res = await getCommentsForApartment(params.id).catch((error) => ({
        ...error.response,
      }));
      setComments(res.data);
    }
  };

  if (!user.ResidentId) {
    return <Heading>Not Logged in</Heading>
  }

  return (
    <main>
      <Flex>
        <Flex
          flexDirection={'column'}
          justifyContent={'center'}
          // alignItems={'center'}
          p={10}
          width="100%"
          // position="relative"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '85%',
            }}
          >
            <ScoreBox
              score={reviewInfo && reviewInfo.OverallAvgScore}
              textSize={'7xl'}
            />
            <Flex flexDirection={'column'} style={{ marginLeft: '50px' }}>
              <ApartmentDescription apartmentInfo={apartmentInfo} />
              <ApartmentAmenities apartmentInfo={apartmentInfo} />
            </Flex>
          </div>
          <div style={{ marginTop: '5%' }}>
            <Flex marginBottom="2%" width="85%">
              <Box flexGrow={1} marginRight={'25%'}>
                <Select
                  isSearchable
                  placeholder={options[0].label}
                  defaultValue={options[0].value}
                  value={filter}
                  options={options}
                  onChange={handleFilterChange}
                  styles={{
                    option: (base) => {
                      base[':active'].backgroundColor = 'lightgray';
                      base.backgroundColor = 'white';

                      return {
                        ...base,
                        color: 'lightgray',
                        ':hover': { background: 'lightblue' },
                        // ':active': { background: 'lightgray' },
                      };
                    },
                  }}
                />
              </Box>
              <Flex alignSelf={'flex-end'}>
                <RatingModal
                  cb={cb}
                  apartmentId={apartmentInfo && apartmentInfo.ApartmentId}
                />
              </Flex>
            </Flex>
            <div style={{ width: '85%' }}>
              {comments &&
                comments.map &&
                comments.map((comment) => (
                  <Comment
                    comment={comment}
                    apartmentInfo={apartmentInfo}
                    onDelete={onDelete}
                    onUpdate={cb}
                  />
                ))}
            </div>
          </div>
        </Flex>
        <aside>
          <Box
            position={'sticky'}
            top="60px"
            height="calc(100vh - 60px)"
            mr="45px"
          >
            <RatingFactors
              reviewInfo={reviewInfo}
              managementScore={managementScore} // TODO: make this update right away
            />
          </Box>
        </aside>
      </Flex>
    </main>
  );
};

// TODO: Add "Add Comment" Button
// "Modify CSS"
