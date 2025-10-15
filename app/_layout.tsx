// import "react-native-gesture-handler";

// import { Stack } from "expo-router";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { ListProvider } from "~/legacy_removed/context/List";
// import { SpotifyProvider } from "~/legacy_removed/context/Spotify";
// import "../global.css";

// export const unstable_settings = {
//     initialRouteName: "login",
// };

// export default function RootLayout() {
//     return (
//         <SpotifyProvider>
//             <ListProvider>
//                 <GestureHandlerRootView style={{ flex: 1 }}>
//                     <Stack>
//                         <Stack.Screen name="index" options={{ headerShown: false }} />
//                         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//                     </Stack>
//                 </GestureHandlerRootView>
//             </ListProvider>
//         </SpotifyProvider>
//     );
// }

// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Home",
                }}
            />
        </Stack>
    );
}
