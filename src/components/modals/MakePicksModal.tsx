import { useState } from 'react';
import { Button, ButtonText } from '@/src/components/ui/button';
import { View, Text } from 'react-native';
import { Center } from '@/src/components/ui/center';
import { Icon } from '@/src/components/ui/icon';
import WeeksAccordion from '@/src/components/accordions/WeeksAccordion';
import { NUMBER_OF_WEEKS } from '@env';

import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/src/components/ui/modal';

function MakePicksModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onPress={() => setShowModal(true)}>
        <ButtonText>Show Modal</ButtonText>
      </Button>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
        className="max-h-[90vh] overflow-y-auto mt-16"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text className="text-typography-950">Invite your team</Text>
            <ModalCloseButton>
              <Text>close</Text>
              {/* <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              /> */}
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <WeeksAccordion />
          </ModalBody>
          {/* <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Explore</ButtonText>
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
}

export default MakePicksModal;
