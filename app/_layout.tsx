import { SpotifyProvider } from "~/context/Spotify";
import "../global.css";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ListProvider } from "~/context/List";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "login",
};

export default function RootLayout() {
    return (
        <SpotifyProvider>
            <ListProvider>
                <GestureHandlerRootView>
                    <Stack>
                        <Stack.Screen name="login" options={{ headerShown: false }} />
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    </Stack>
                </GestureHandlerRootView>
            </ListProvider>
        </SpotifyProvider>
    );
}
