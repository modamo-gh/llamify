import { Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import { Dimensions, FlatList, Image, Keyboard, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSpotify } from '~/context/Spotify';

type SpotifyItem = {
  name: string;
  type: string;
};

const Search = () => {
  const { token, user } = useSpotify();

  const [searchResults, setSearchResults] = useState<SpotifyItem[]>([]);
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
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(term.trim())}&type=album,artist,audiobook,episode,playlist,show,track&limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await results.json();
        const r: SpotifyItem[] = [];

        for (const type in data) {
          if (type === 'tracks') {
            r.push(
              ...data[type]?.items?.map(
                (item) =>
                  ({
                    imageURL: item?.album?.images?.[0]?.url || '../../assets/playstore.png',
                    name: item.name || '',
                    type,
                  }) as SpotifyItem
              )
            );
          } else {
            r.push(
              ...data[type]?.items?.filter(Boolean).map((item) => {
                return {
                  imageURL: item?.images?.[0]?.url || '../../assets/playstore.png',
                  name: item?.name || '',
                  type,
                } as SpotifyItem;
              })
            );
          }
        }

        for (let i = r.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * i);

          [r[i], r[j]] = [r[j], r[i]];
        }

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
              <View className="" style={{ width: imageDimension }}>
                <Image
                  className="aspect-square w-full rounded-lg"
                  source={{ uri: item.imageURL }}
                />
                <Text className="text-zinc-50/80" numberOfLines={1}>
                  Name: {item.name}
                </Text>
                <Text className="text-zinc-50/80">
                  Type: {item.type[0].toUpperCase()}
                  {item.type.slice(1, item.type.length - 1)}
                </Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default Search;
