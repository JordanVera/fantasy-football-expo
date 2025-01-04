import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function AuthScreen() {
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
      // Navigation will be handled by your navigation container based on auth state
    } catch (error) {
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
    <View className="items-center justify-center flex-1 px-4">
      <Text className="mb-8 text-2xl font-bold">
        {isLogin ? 'Login' : 'Sign Up'}
      </Text>

      {error ? <Text className="mb-4 text-red-500">{error}</Text> : null}

      {!isLogin && (
        <TextInput
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="w-full px-6 py-3 mb-4 bg-blue-500 rounded-lg"
        onPress={handleSubmit}
      >
        <Text className="font-semibold text-center text-white">
          {isLogin ? 'Login' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleAuthMode}>
        <Text className="text-blue-500">
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
