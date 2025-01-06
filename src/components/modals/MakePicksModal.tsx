import { useState } from 'react';
import { Button, ButtonText } from '@/src/components/ui/button';
import { View, Text } from 'react-native';
import { Center } from '@/src/components/ui/center';
import { Icon } from '@/src/components/ui/icon';
import WeeksAccordion from '@/src/components/accordions/WeeksAccordion';
import { NUMBER_OF_WEEKS } from '@env';
import { XIcon } from 'lucide-react-native';

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
        onClose={() => setShowModal(false)}
        size="md"
        className="max-h-[90vh] overflow-y-auto mt-16 border "
      >
        <ModalBackdrop />
        <ModalContent className="bg-gray-900 border-gray-700">
          <ModalHeader>
            <Text className="text-xl font-bold text-white">
              Make Your Picks
            </Text>
            <ModalCloseButton>
              <Icon
                as={XIcon}
                size="md"
                className="stroke-gray-400 group-[:hover]/modal-close-button:stroke-gray-300 group-[:active]/modal-close-button:stroke-gray-200"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <WeeksAccordion />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MakePicksModal;
