import '@/global.css';
import { NavigationContainer } from '@react-navigation/native';
import { GluestackUIProvider } from './src/components/ui/gluestack-ui-provider';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { UsersProvider } from './src/context/UserContext';

import 'nativewind';

import './global.css';

function Navigation() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return user ? <BottomTabNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <UsersProvider>
        <GluestackUIProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </GluestackUIProvider>
      </UsersProvider>
    </AuthProvider>
  );
}
