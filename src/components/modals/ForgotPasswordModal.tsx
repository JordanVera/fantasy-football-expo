import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { useState } from 'react';
import { api } from '../../services/ApiService';

type ForgotPasswordModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function ForgotPasswordModal({
  isVisible,
  onClose,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');

  const handleRequestReset = async () => {
    try {
      await api.forgotPassword(email);
      setStep('reset');
      setError('');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to send reset instructions'
      );
    }
  };

  const handleResetPassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      await api.resetPassword(resetToken, newPassword);
      onClose();
      // You might want to show a success toast here
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to reset password'
      );
    }
  };

  const handleClose = () => {
    setEmail('');
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setStep('email');
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="items-center justify-center flex-1 bg-black/50">
          <View className="w-[90%] bg-gray-900 p-6 rounded-lg">
            <Text className="mb-6 text-2xl font-bold text-white">
              {step === 'email' ? 'Reset Password' : 'Enter Reset Code'}
            </Text>

            {step === 'email' ? (
              <TextInput
                className="w-full px-4 py-2 mb-4 text-white bg-gray-800 border border-gray-700 rounded"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#6B7280"
              />
            ) : (
              <>
                <TextInput
                  className="w-full px-4 py-2 mb-4 text-white bg-gray-800 border border-gray-700 rounded"
                  placeholder="Enter reset token"
                  value={resetToken}
                  onChangeText={setResetToken}
                  autoCapitalize="none"
                  placeholderTextColor="#6B7280"
                />
                <TextInput
                  className="w-full px-4 py-2 mb-4 text-white bg-gray-800 border border-gray-700 rounded"
                  placeholder="New password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholderTextColor="#6B7280"
                />
                <TextInput
                  className="w-full px-4 py-2 mb-4 text-white bg-gray-800 border border-gray-700 rounded"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholderTextColor="#6B7280"
                />
              </>
            )}

            {error ? (
              <Text className="mb-4 text-sm text-center text-red-500">
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              className="w-full px-6 py-3 mb-4 bg-blue-600 rounded-lg"
              onPress={
                step === 'email' ? handleRequestReset : handleResetPassword
              }
            >
              <Text className="font-semibold text-center text-white">
                {step === 'email'
                  ? 'Send Reset Instructions'
                  : 'Reset Password'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleClose}>
              <Text className="text-center text-blue-400">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
