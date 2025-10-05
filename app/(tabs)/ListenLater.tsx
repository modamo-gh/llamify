import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ListenScreen from "~/components/ListenScreen";
import { useList } from "~/context/List";

const ListenLater = () => {
    const { listenLater } = useList();

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex flex-1 bg-neutral-900" edges={["top"]}>
                <ListenScreen list={listenLater} />
            </SafeAreaView>
        </>
    );
};

export default ListenLater;
