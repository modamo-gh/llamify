import { FontAwesome } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from "expo-checkbox";
import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, Image, Linking, Pressable, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";
import { useList } from "~/context/List";
import { useSpotify } from "~/context/Spotify";
import { Mode, SpotifyItem } from "~/types";

const ListenScreen = ({ list }: { list: SpotifyItem[] }) => {
    const { removeFromList } = useList();

    const snapPoints = useMemo(() => ["25%"], []);

    const ref = useRef<BottomSheet>(null);

    const { user } = useSpotify();

    const [filters, setFilters] = useState<Map<string, boolean>>(
        new Map([
            ["Albums", true],
            ["Artists", true],
            ["Audiobooks", true],
            ["Episodes", true],
            ["Playlists", true],
            ["Shows", true],
            ["Tracks", true],
        ])
    );
    const [mode, setMode] = useState<Mode>("");
    const [showBottomSheet, setBottomSheet] = useState(false);

    useEffect(() => {
        const migrateListenToday = async () => {
            // await AsyncStorage.removeItem("llamify_hasBeenPrompted");

            if (list.every((item) => item.list === "today")) {
                const hasBeenPrompted =
                    (await AsyncStorage.getItem("llamify_hasBeenPrompted")) || "false";

                if (!JSON.parse(hasBeenPrompted)) {
                    setMode("prompt");
                    setBottomSheet(true);

                    await AsyncStorage.setItem("llamify_hasBeenPrompted", "true");
                }
            }
        };

        migrateListenToday();
    }, []);

    const bottomSheetOptionHeight = Dimensions.get("window").height / 15;

    const displayBottomSheet = (mode: Mode) => {
        switch (mode) {
            case "":
            case "filter":
                return (
                    <BottomSheet
                        backgroundStyle={{ backgroundColor: "#22C55E" }}
                        enablePanDownToClose
                        index={showBottomSheet ? 1 : -1}
                        onClose={() => setBottomSheet(false)}
                        ref={ref}
                        snapPoints={snapPoints}>
                        <BottomSheetView className="bg-green-500">
                            {[...filters.keys()].map((key) => (
                                <Pressable
                                    className="flex h-12 w-full flex-row items-center"
                                    key={key}
                                    style={{ height: bottomSheetOptionHeight }}
                                    onPress={() =>
                                        setFilters((prev) => {
                                            const f = new Map(prev);

                                            f.set(key, !f.get(key));

                                            return f;
                                        })
                                    }>
                                    <View className="flex flex-1 items-center">
                                        <Checkbox
                                            color={filters.get(key) ? "#262626" : ""}
                                            onValueChange={() =>
                                                setFilters((prev) => {
                                                    const f = new Map(prev);

                                                    f.set(key, !f.get(key));

                                                    return f;
                                                })
                                            }
                                            value={filters.get(key)}
                                        />
                                    </View>
                                    <View className="flex flex-1 items-center">
                                        <Text className="text-xl font-bold text-zinc-50">
                                            {key}
                                        </Text>
                                    </View>
                                </Pressable>
                            ))}
                        </BottomSheetView>
                    </BottomSheet>
                );
            case "prompt":
                return (
                    <BottomSheet
                        backgroundStyle={{ backgroundColor: "#22C55E" }}
                        enablePanDownToClose
                        index={showBottomSheet ? 1 : -1}
                        onClose={() => setBottomSheet(false)}
                        ref={ref}
                        snapPoints={snapPoints}>
                        <BottomSheetView className="bg-green-500">
                            <Pressable
                                className="flex w-full items-center justify-center "
                                style={{ height: bottomSheetOptionHeight }}
                                onPress={() => {}}>
                                <Text className="text-xl font-bold text-zinc-50"></Text>
                            </Pressable>
                        </BottomSheetView>
                    </BottomSheet>
                );
            case "sort":
                return (
                    <BottomSheet
                        backgroundStyle={{ backgroundColor: "#22C55E" }}
                        enablePanDownToClose
                        index={showBottomSheet ? 1 : -1}
                        onClose={() => setBottomSheet(false)}
                        ref={ref}
                        snapPoints={snapPoints}>
                        <BottomSheetView className="bg-green-500">
                            <Pressable
                                className="flex w-full items-center justify-center "
                                style={{ height: bottomSheetOptionHeight }}
                                onPress={() => {}}>
                                <Text className="text-xl font-bold text-zinc-50"></Text>
                            </Pressable>
                        </BottomSheetView>
                    </BottomSheet>
                );
        }
    };

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

        const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

        return (
            <AnimatedPressable
                className="flex w-[100px] items-center justify-center rounded-l-lg bg-red-500 active:opacity-80"
                onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                    await removeFromList(item, "today");
                }}
                style={animatedStyle}>
                <Text className="text-xl text-zinc-50">Delete</Text>
            </AnimatedPressable>
        );
    };

    return (
        <>
            <View className="flex w-full flex-1 flex-row gap-4 px-4">
                <View className="flex flex-1 flex-row items-center justify-around">
                    <Pressable
                        className="active:opacity-80"
                        disabled={list.length === 0}
                        onPress={() => {
                            if (list.length) {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                                setBottomSheet((prev) => {
                                    if (prev) {
                                        ref.current?.close();
                                    }

                                    return !prev;
                                });
                            }
                        }}>
                        <View className="flex h-12 w-[72px] items-center justify-center rounded-lg bg-neutral-800">
                            <Text className="text-xl text-zinc-50">Filter</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        className="active:opacity-80"
                        disabled={list.length === 0}
                        onPress={() => {
                            if (list.length) {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                                setBottomSheet((prev) => {
                                    if (prev) {
                                        ref.current?.close();
                                    }

                                    return !prev;
                                });
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
                className={`${!list.length && "items-center justify-center"} flex w-full flex-[9] p-4`}>
                {list.length ? (
                    <FlatList
                        contentContainerClassName="gap-4"
                        data={list.filter((item) =>
                            filters.get(`${item.type[0].toUpperCase()}${item.type.slice(1)}`)
                        )}
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
                                        <Text className="text-xl text-zinc-50" numberOfLines={1}>
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
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                                            try {
                                                const canOpen = await Linking.canOpenURL(item.uri);

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
            {showBottomSheet && displayBottomSheet(mode)}
        </>
    );
};

export default ListenScreen;
