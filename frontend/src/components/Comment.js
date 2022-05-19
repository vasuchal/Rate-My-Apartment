import { Text, Flex, Button, IconButton } from '@chakra-ui/react';
import { ScoreBox } from './ScoreBox';
import { TrashIcon, PencilIcon } from 'chakra-ui-ionicons';
import { RatingModal } from './modal/NewRating';
import { deleteComment } from '../utils/apiWrapper';

export const Comment = ({ comment, apartmentInfo, onDelete, onUpdate }) => {
  const handleDelete = async () => {
    await deleteComment(comment.CommentId);
    onDelete(comment.CommentId);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'left',
        marginBottom: '2%',
        backgroundColor: '#082C4D',
        padding: '15px',
        borderRadius: '1rem',
        justifyContent: 'space-between',
      }}
    >
      <ScoreBox score={comment.OverallScore} textSize="1xl" />
      <Flex flexGrow={4}>
        <Text color="white" alignSelf="center" p={4} fontSize="md">
          {comment.FeedbackText}
        </Text>
      </Flex>
      <Flex alignItems={'flex-end'}>
        <Flex>
          <Flex>
            <RatingModal
              comment={comment}
              apartmentId={apartmentInfo.ApartmentId}
              cb={onUpdate}
            />
          </Flex>
          <Flex marginLeft={'20%'} paddingRight={8}>
            <Button size="xs" onClick={handleDelete}>
              <TrashIcon color="082C4D" w={6} h={6} />
            </Button>
          </Flex>
        </Flex>
      </Flex>

      <div>
        <h1>{comment.CommentDate} </h1> {/* TODO: Add this */}
      </div>
    </div>
  );
};
