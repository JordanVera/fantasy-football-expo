import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export function AuthScreen() {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      // @ts-ignore - Navigate to Home screen after successful auth
      navigation.navigate('Home');
    } catch (error) {
      console.log('_____error_____');
      console.log(error);

      setError(
        isLogin
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
    setName('');
  };

  return (
    <View className="items-center justify-center flex-1 px-4 bg-gray-900">
      <Text className="mb-8 text-2xl font-bold text-white">
        {isLogin ? 'Login' : 'Sign Up'}
      </Text>

      {error ? <Text className="mb-4 text-red-500">{error}</Text> : null}

      {!isLogin && (
        <TextInput
          className="w-full px-4 py-2 mb-4 text-white bg-gray-800 border border-gray-700 rounded placeholder:text-gray-500"
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#6B7280"
        />
      )}

      <TextInput
        className="w-full px-4 py-2 mb-4 text-white bg-gray-800 border border-gray-700 rounded placeholder:text-gray-500"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#6B7280"
      />

      <TextInput
        className="w-full px-4 py-2 mb-6 text-white bg-gray-800 border border-gray-700 rounded placeholder:text-gray-500"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#6B7280"
      />

      <TouchableOpacity
        className="w-full px-6 py-3 mb-4 bg-blue-600 rounded-lg"
        onPress={handleSubmit}
      >
        <Text className="font-semibold text-center text-white">
          {isLogin ? 'Login' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleAuthMode}>
        <Text className="text-blue-400">
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
