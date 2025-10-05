import { FontAwesome } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { FlatList, Image, Linking, Pressable, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useList } from "~/context/List";
import { useSpotify } from "~/context/Spotify";
import { SpotifyItem } from "~/types";

const ListenLater = () => {
    const { listenLater, removeFromList } = useList();

    const { user } = useSpotify();

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

    const renderLeft = (
        progress: SharedValue<number>,
        dragX: SharedValue<number>,
        item: SpotifyItem
    ) => {
        const animatedStyle = useAnimatedStyle(() => ({
            transform: [
                {
                    translateX: interpolate(
                        dragX.value,
                        [0, 50, 100],
                        [-100, -50, 0],
                        Extrapolation.CLAMP
                    ),
                },
            ],
        }));

        return (
            <AnimatedPressable
                className="flex w-[100px] items-center justify-center rounded-l-lg bg-red-500 active:opacity-80"
                onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                    await removeFromList(item, "later");
                }}
                style={animatedStyle}>
                <Text className="text-xl text-zinc-50">Delete</Text>
            </AnimatedPressable>
        );
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex flex-1 bg-neutral-900" edges={["top"]}>
                <View className="flex w-full flex-1 flex-row gap-4 px-4">
                    <View className="flex flex-1 flex-row items-center justify-around">
                        <Pressable
                            className="active:opacity-80"
                            disabled={listenLater.length === 0}
                            onPress={() => {
                                console.log(listenLater);
                                if (listenLater.length) {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                }
                            }}>
                            <View className="flex h-12 w-[72px] items-center justify-center rounded-lg bg-neutral-800">
                                <Text className="text-xl text-zinc-50">Filter</Text>
                            </View>
                        </Pressable>
                        <Pressable
                            className="active:opacity-80"
                            disabled={listenLater.length === 0}
                            onPress={() => {
                                if (listenLater.length) {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                }
                            }}>
                            <View className="flex h-12 w-[72px] items-center justify-center rounded-lg bg-neutral-800">
                                <Text className="text-xl text-zinc-50">Sort</Text>
                            </View>
                        </Pressable>
                    </View>
                    <Image
                        className="aspect-square max-h-full max-w-full rounded-lg"
                        source={{ uri: user?.images?.[0]?.url }}
                    />
                </View>
                <View
                    className={`${!listenLater.length && "items-center justify-center"} flex w-full flex-[9] p-4`}>
                    {listenLater.length ? (
                        <FlatList
                            contentContainerClassName="gap-4"
                            style={{ flex: 1 }}
                            data={listenLater}
                            renderItem={({ item }) => (
                                <Swipeable
                                    onSwipeableCloseStartDrag={() =>
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                                    }
                                    onSwipeableOpenStartDrag={() =>
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                                    }
                                    overshootLeft={false}
                                    renderLeftActions={(progress, dragX) =>
                                        renderLeft(progress, dragX, item)
                                    }
                                    renderRightActions={(progress, dragX, swipeable) => null}>
                                    <View className="flex h-[96px] w-full flex-row items-center gap-2 rounded-lg bg-neutral-800 p-2 shadow-lg">
                                        <Image
                                            className="aspect-square h-full rounded-lg"
                                            source={{ uri: item.imageURL }}
                                        />
                                        <View className="flex h-full flex-1 justify-around">
                                            <Text
                                                className="text-xl text-zinc-50"
                                                numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                            <Text className="text-zinc-50/80" numberOfLines={1}>
                                                {item.type[0].toUpperCase()}
                                                {item.type.slice(1, item.type.length - 1)}
                                            </Text>
                                        </View>
                                        <Pressable
                                            className="active:opacity-80"
                                            onPress={async () => {
                                                Haptics.impactAsync(
                                                    Haptics.ImpactFeedbackStyle.Medium
                                                );

                                                try {
                                                    const canOpen = await Linking.canOpenURL(
                                                        item.uri
                                                    );

                                                    if (canOpen) {
                                                        await Linking.openURL(item.uri);
                                                    } else {
                                                        await Linking.openURL(
                                                            item.uri
                                                                .split(":")
                                                                .join("/")
                                                                .replace(
                                                                    "spotify",
                                                                    "https://open.spotify.com"
                                                                )
                                                        );
                                                    }
                                                } catch (error) {
                                                    console.error("Error opening Spotify:", error);
                                                }
                                            }}>
                                            <View className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                                                <FontAwesome name="play" size={20} />
                                            </View>
                                        </Pressable>
                                    </View>
                                </Swipeable>
                            )}
                        />
                    ) : (
                        <Text className="text-xl text-zinc-50">Add Items from the Search tab</Text>
                    )}
                </View>
            </SafeAreaView>
        </>
    );
};

export default ListenLater;
