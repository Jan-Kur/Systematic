import { Redirect } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useSession } from '../contexts/AuthContext';

export default function Auth() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Logging you in...</Text>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/" />;
  }
}