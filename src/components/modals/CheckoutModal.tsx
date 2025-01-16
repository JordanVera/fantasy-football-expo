import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CheckoutModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  visible,
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
        returnURL: 'nfllastlonger://', // Your app's URL scheme
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
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Purchase Entries</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>Number of Entries</Text>
            <TextInput
              style={styles.input}
              value={numberOfEntries}
              onChangeText={setNumberOfEntries}
              keyboardType="number-pad"
              placeholder="Enter number of entries"
              placeholderTextColor="#666"
              maxLength={2}
              editable={!loading}
            />

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Total Price:</Text>
              <Text style={styles.price}>
                ${(parseInt(numberOfEntries) || 0) * 60}.00
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.checkoutButton,
                (!numberOfEntries || loading) && styles.checkoutButtonDisabled,
              ]}
              onPress={handleCheckout}
              disabled={!numberOfEntries || loading}
            >
              <Text style={styles.checkoutButtonText}>
                {loading ? 'Processing...' : 'Checkout'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  body: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: '#000',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    padding: 12,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  checkoutButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#A5A5A5',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  stripeLogo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export default CheckoutModal;
