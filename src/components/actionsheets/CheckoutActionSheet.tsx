import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ButtonText } from '@/src/components/ui/button';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from '@/src/components/ui/actionsheet';

interface CheckoutActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutActionSheet: React.FC<CheckoutActionSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const [numberOfEntries, setNumberOfEntries] = useState('');
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create a payment intent on your server
      const response = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lineItems: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'NFL Last Longer Entry',
                },
                unit_amount: 6000, // $60.00
              },
              quantity: parseInt(numberOfEntries),
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { paymentIntent, ephemeralKey, customer } = await response.json();

      // Initialize the Payment Sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'NFL Last Longer',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        returnURL: Platform.select({
          ios: 'nfllastlonger://stripe-redirect',
          android: 'nfllastlonger://stripe-redirect',
        }),
        defaultBillingDetails: {
          name: user?.username,
        },
        style: 'automatic',
      });

      if (initError) {
        Alert.alert(
          'Error',
          initError.message || 'Failed to initialize payment'
        );
        return;
      }

      // Present the Payment Sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert('Error', presentError.message || 'Payment failed');
      } else {
        Alert.alert('Success', 'Payment successful!');
        onClose();
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="border-0 bg-zinc-800">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-zinc-500" />
          </ActionsheetDragIndicatorWrapper>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="w-full p-4">
              <Text className="mb-6 text-2xl font-bold text-white">
                Purchase Entries
              </Text>

              <View>
                <Text className="text-base text-white">Number of Entries</Text>
                <TextInput
                  className="p-3 text-white border rounded-lg bg-zinc-700 border-zinc-600"
                  value={numberOfEntries}
                  onChangeText={setNumberOfEntries}
                  keyboardType="number-pad"
                  placeholder="Enter number of entries"
                  placeholderTextColor="#666"
                  maxLength={2}
                  editable={!loading}
                />

                <View className="flex-row items-center justify-between mt-4">
                  <Text className="text-base text-white">Total Price:</Text>
                  <Text className="text-xl font-bold text-white">
                    ${(parseInt(numberOfEntries) || 0) * 60}.00
                  </Text>
                </View>

                <View className="flex-row justify-between gap-4 mt-6">
                  <Button
                    onPress={onClose}
                    variant="outline"
                    className="flex-1"
                    disabled={loading}
                  >
                    <ButtonText className="text-red-500">Cancel</ButtonText>
                  </Button>

                  <Button
                    onPress={handleCheckout}
                    disabled={!numberOfEntries || loading}
                    className="flex-1 bg-blue-600"
                  >
                    <ButtonText>
                      {loading ? 'Processing...' : 'Checkout'}
                    </ButtonText>
                  </Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default CheckoutActionSheet;
