import { NavigationContainer } from '@react-navigation/native';
import '@/global.css';
import { GluestackUIProvider } from './src/components/ui/gluestack-ui-provider';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import 'nativewind';

import './global.css';

function Navigation() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return user ? <BottomTabNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <NavigationContainer>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
