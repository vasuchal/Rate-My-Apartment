import {
  useDisclosure,
  Modal,
  Button,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  RadioGroup,
  Radio,
  HStack,
  FormHelperText,
  IconButton,
  useRadioGroup,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { PencilIcon } from 'chakra-ui-ionicons';
import { Fragment, useEffect, useRef } from 'react';
import { addComment, updateComment } from '../../utils/apiWrapper';
import { useState } from 'react';

export const RatingModal = ({ comment, apartmentId, cb }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [noiseScore, setNoiseScore] = useState(
    comment ? comment.NoiseScore : 3,
  );
  const [locationScore, setLocationScore] = useState(
    comment ? comment.LocationScore : 3,
  );
  const [wifiScore, setWifiScore] = useState(comment ? comment.WifiScore : 3);
  const [overallScore, setOverallScore] = useState(
    comment ? comment.OverallScore : 3,
  );
  const [feedbackText, setFeedbackText] = useState('');

  const initialRef = useRef();
  const finalRef = useRef();

  useEffect(() => {
    return () => {
      setNoiseScore(3);
      setLocationScore(3);
      setWifiScore(3);
      setOverallScore(3);
      setFeedbackText('');
    };
  }, [isOpen]);

  const submitRating = async () => {
    const residentId = 799;
    let rating = {
      residentId,
      apartmentId,
      feedback: feedbackText,
      overallScore,
      noiseScore,
      locationScore,
      wifiScore,
    };

    if (comment) {
      await updateComment({ id: comment.CommentId, feedbackText });
    } else {
      const res = await addComment(rating);
      console.log(res);
    }

    cb();
    onClose();
  };

  return (
    <Fragment>
      {comment && (
        <Button onClick={onOpen}>
          <PencilIcon color="082C4D" w={6} h={6}></PencilIcon>
        </Button>
      )}
      {!comment && (
        <Button
          onClick={onOpen}
          _hover={{ bg: 'telegram.500' }}
          bg="telegram.700"
          color="white"
          leftIcon={<AddIcon />}
        >
          Add Rating
        </Button>
      )}

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave a Rating</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isDisabled={comment}>
              <FormLabel as="legend">Noise Rating</FormLabel>
              <FormHelperText>1: Too Noisy, 5: Soundproof</FormHelperText>
              <RadioGroup
                name="noise"
                onChange={(value) => setNoiseScore(parseInt(value))}
                value={`${noiseScore}`}
              >
                <HStack spacing="24px">
                  <Radio value="1">1</Radio>
                  <Radio value="2">2</Radio>
                  <Radio value="3">3</Radio>
                  <Radio value="4">4</Radio>
                  <Radio value="5">5</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            <FormControl isRequired isDisabled={comment}>
              <FormLabel as="legend">Location Rating</FormLabel>
              <RadioGroup
                name="location"
                onChange={(value) => setLocationScore(parseInt(value))}
                value={`${locationScore}`}
              >
                <HStack spacing="24px">
                  <Radio value="1">1</Radio>
                  <Radio value="2">2</Radio>
                  <Radio value="3">3</Radio>
                  <Radio value="4">4</Radio>
                  <Radio value="5">5</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            <FormControl isRequired isDisabled={comment}>
              <FormLabel as="legend">Wifi Rating</FormLabel>
              <RadioGroup
                name="wifi"
                onChange={(value) => setWifiScore(parseInt(value))}
                value={`${wifiScore}`}
              >
                <HStack spacing="24px">
                  <Radio value="1">1</Radio>
                  <Radio value="2">2</Radio>
                  <Radio value="3">3</Radio>
                  <Radio value="4">4</Radio>
                  <Radio value="5">5</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            <FormControl isRequired isDisabled={comment}>
              <FormLabel as="legend">Overall Apartment Rating</FormLabel>
              <RadioGroup
                name="overall"
                onChange={(value) => setOverallScore(parseInt(value))}
                value={`${overallScore}`}
              >
                <HStack spacing="24px">
                  <Radio value="1">1</Radio>
                  <Radio value="2">2</Radio>
                  <Radio value="3">3</Radio>
                  <Radio value="4">4</Radio>
                  <Radio value="5">5</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Leave a Comment!</FormLabel>
              <Input
                ref={initialRef}
                placeholder="I lived here sophomore year, and I..."
                defaultValue={comment ? comment.FeedbackText : feedbackText}
                onChange={(event) => setFeedbackText(event.currentTarget.value)}
              />
            </FormControl>

            <ModalFooter>
              <Button onClick={submitRating} colorScheme="blue" mr={3}>
                {comment ? 'Update' : 'Create'}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};
