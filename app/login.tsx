import { useRouter } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { useSpotify } from '~/context/Spotify';

const Login = () => {
  const router = useRouter();

  const { token, promptAsync } = useSpotify();

  return (
    <View className="flex flex-1 items-center justify-center bg-neutral-900">
      <View className="flex flex-[4] items-center justify-center">
        <Image className="h-96 w-96" source={require('../assets/playstore.png')} />
      </View>
      <View className="flex-1">
        <Pressable
          className="flex h-12 w-64 items-center justify-center rounded-lg bg-green-500 px-2 py-1 active:bg-green-600"
          onPress={() => {
            promptAsync();
            if (token) {
              router.push('/(tabs)/search');
            }
          }}>
          <Text className="text-lg font-semibold text-zinc-50">Login with Spotify</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;
