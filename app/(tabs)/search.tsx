import { Stack } from 'expo-router';
import { Image, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpotify } from '~/context/Spotify';

const Search = () => {
  const { user } = useSpotify();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex flex-1 bg-neutral-900">
        <View className="flex w-full flex-1 flex-row gap-4 px-4">
          <TextInput
            className="flex-1 rounded-lg border border-green-500 px-2 text-zinc-50"
            placeholder="Enter a search term or Spotify URL"
            placeholderTextColor="#7D7D7D"
          />
          <Image
            className="aspect-square max-h-full max-w-full rounded-lg"
            source={{ uri: user?.images?.[0]?.url }}
          />
        </View>
        <View className="flex-[9] bg-blue-500"></View>
      </SafeAreaView>
    </>
  );
};

export default Search;
