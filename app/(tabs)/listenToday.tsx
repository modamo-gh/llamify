import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListenToday = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex flex-1 bg-neutral-900"></SafeAreaView>
    </>
  );
};

export default ListenToday;
