import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ListenScreen from "~/components/ListenScreen";
import { useList } from "~/legacy_removed/context/List";

const ListenToday = () => {
    const { listenToday } = useList();

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex flex-1 bg-neutral-900" edges={["top"]}>
                <ListenScreen list={listenToday} />
            </SafeAreaView>
        </>
    );
};

export default ListenToday;
