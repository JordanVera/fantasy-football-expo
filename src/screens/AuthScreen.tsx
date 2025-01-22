import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ForgotPasswordModal from '../components/modals/ForgotPasswordModal';

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async () => {
    try {
      if (!isLogin && password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (isLogin) {
        await login(email, password);
      } else {
        await signup({
          email,
          password,
          firstname,
          lastname,
          username,
          phoneNumber,
        });
      }
    } catch (error) {
      console.log('_____error_____');
      console.log(error);

      setError(
        error instanceof Error
          ? error.message
          : isLogin
          ? 'Login failed. Please check your credentials.'
          : 'Signup failed. Please try again.'
      );
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstname('');
    setLastname('');
    setUsername('');
    setPhoneNumber('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-black">
        <View className="items-center justify-center flex-1 px-8">
          <View className="w-full max-w-sm">
            <Image
              source={require('../media/logo.png')}
              className="!w-28 !h-28 mx-auto"
            />
            <Text className="mb-8 text-2xl font-bold text-center text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>

            <View className="flex flex-col gap-5 mb-6">
              {!isLogin && (
                <>
                  <View className="flex flex-row gap-2">
                    <TextInput
                      className="flex-1 px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-full placeholder:text-gray-500"
                      placeholder="First Name"
                      value={firstname}
                      onChangeText={setFirstname}
                      placeholderTextColor="#6B7280"
                    />

                    <TextInput
                      className="flex-1 px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-full placeholder:text-gray-500"
                      placeholder="Last Name"
                      value={lastname}
                      onChangeText={setLastname}
                      placeholderTextColor="#6B7280"
                    />
                  </View>

                  <TextInput
                    className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-full placeholder:text-gray-500"
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    placeholderTextColor="#6B7280"
                  />

                  <TextInput
                    className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-full placeholder:text-gray-500"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    placeholderTextColor="#6B7280"
                  />
                </>
              )}

              <TextInput
                className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-full placeholder:text-gray-500"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#6B7280"
              />

              <TextInput
                className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-full placeholder:text-gray-500"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#6B7280"
              />

              {!isLogin && (
                <TextInput
                  className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-full placeholder:text-gray-500"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholderTextColor="#6B7280"
                />
              )}
              <TouchableOpacity
                className="w-full px-6 py-3 bg-blue-600 rounded-full"
                onPress={handleSubmit}
              >
                <Text className="font-semibold text-center text-white">
                  {isLogin ? 'Login' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>

            {isLogin && (
              <Pressable
                onPress={() => setShowForgotPassword(true)}
                className="flex flex-row justify-center w-full"
              >
                <Text className="mb-5 text-blue-500">I forgot my password</Text>
              </Pressable>
            )}

            {error ? (
              <Text className="mb-4 text-sm text-center text-red-500">
                {error}
              </Text>
            ) : null}

            <TouchableOpacity onPress={toggleAuthMode}>
              <Text className="text-center">
                <Text className="text-white">
                  {isLogin
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                </Text>
                <Text className="text-blue-400">
                  {isLogin ? 'Sign up' : 'Login'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ForgotPasswordModal
          isVisible={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
