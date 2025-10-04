import { Stack } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useList } from "~/context/List";

const ListenToday = () => {
    const { listenToday } = useList();

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex flex-1 bg-neutral-900">
                <Text>{JSON.stringify(listenToday)}</Text>
            </SafeAreaView>
        </>
    );
};

export default ListenToday;
