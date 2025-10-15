import { Stack } from "expo-router";
import { ListProvider } from "~/context/List";
import { SpotifyProvider } from "~/context/Spotify";
import "../global.css";

export default function RootLayout() {
    return (
        <SpotifyProvider>
            <ListProvider>
                <Stack>
                    <Stack.Screen
                        name="index"
                        options={{
                            headerShown: false,
                            title: "Login",
                        }}
                    />
                </Stack>
            </ListProvider>
        </SpotifyProvider>
    );
}
