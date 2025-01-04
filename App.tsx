import { NavigationContainer } from '@react-navigation/native';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { AuthProvider } from './src/context/AuthContext';
import 'nativewind';

import './global.css';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <BottomTabNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
