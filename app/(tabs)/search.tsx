import { Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, FlatList, Image, Keyboard, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpotify } from '~/context/Spotify';

const Search = () => {
  const { token, user } = useSpotify();

  const [searchResults, setSearchResults] = useState<string[]>([]);
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

      try {
        const results = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(term.trim())}&type=album&limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await results.json();
        const r = [...data.albums.items.map((item) => item.images[0].url)];

        console.log(r);
        setSearchResults(r);
      } catch (error) {}
    }, 400),
    []
  );

  const screenWidth = Dimensions.get('screen').width;
  const imageDimension = (screenWidth - 40) / 2;

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
        <View className="flex w-full flex-[9] p-4">
          <FlatList
            className="w-full flex-1"
            columnWrapperClassName="gap-4"
            contentContainerClassName="gap-4"
            data={searchResults}
            keyExtractor={(item, index) => `${index}`}
            numColumns={2}
            renderItem={({ item }) => (
              <Image
                className="rounded-lg"
                source={{ uri: item }}
                style={{ height: imageDimension, width: imageDimension }}
              />
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default Search;
