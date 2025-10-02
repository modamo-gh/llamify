import { Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Keyboard, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpotify } from '~/context/Spotify';

const Search = () => {
  const { user } = useSpotify();

  const [searchTerm, setSearchTerm] = useState('');

  const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
    let timeOutID: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      if (timeOutID) {
        clearTimeout(timeOutID);
      }

      timeOutID = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const getDebouncedResults = useCallback(
    debounce(async (term: string) => {
      if (!term) {
        return;
      }

      console.log(term);
    }, 400),
    []
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex flex-1 bg-neutral-900">
        <View className="flex w-full flex-1 flex-row gap-4 px-4">
          <TextInput
            className="flex-1 rounded-lg border border-green-500 px-2 text-zinc-50"
            onChangeText={(term) => {
              setSearchTerm(term);
              getDebouncedResults(term);
            }}
            onEndEditing={() => Keyboard.dismiss()}
            placeholder="Enter a search term or Spotify URL"
            placeholderTextColor="#7D7D7D"
            value={searchTerm}
          />
          <Image
            className="aspect-square max-h-full max-w-full rounded-lg"
            source={{ uri: user?.images?.[0]?.url }}
          />
        </View>
        <View className="flex-[9]"></View>
      </SafeAreaView>
    </>
  );
};

export default Search;
