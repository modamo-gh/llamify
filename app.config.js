import "dotenv/config";

export default {
    expo: {
        android: {
            adaptiveIcon: {
                backgroundColor: "#ffffff",
                foregroundImage: "./assets/adaptive-icon.png",
            },
            package: "xyz.modamo.llamify",
        },
        assetBundlePatterns: ["**/*"],
        experiments: { typedRoutes: true, tsconfigPaths: true },
        extra: {
            eas: { projectId: "0e83b1fc-9d9d-45ef-9e56-57ee0bfc42a7" },
            EXPO_PUBLIC_SPOTIFY_CLIENT_ID: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID,
            EXPO_PUBLIC_SUPABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY,
            EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
        },
        icon: "./assets/icon.png",
        ios: {
            bundleIdentifier: "xyz.modamo.llamify",
            darkModeIcon: "./assets/icon.png",
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
                LSApplicationQueriesSchemes: ["spotify"],
                NSAppTransportSecurity: { NSAllowsArbitraryLoads: true },
            },
            supportsTablet: true,
        },
        name: "llamify",
        newArchEnabled: false,
        orientation: "portrait",
        owner: "morganthemosaic",
        plugins: ["expo-router", "expo-web-browser"],
        scheme: "llamify",
        slug: "llamify",
        splash: { image: "./assets/splash.png", resizeMode: "contain", backgroundColor: "#ffffff" },
        userInterfaceStyle: "light",
        version: "2025.10.14",
        web: { bundler: "metro", output: "static", favicon: "./assets/favicon.png" },
    },
};
