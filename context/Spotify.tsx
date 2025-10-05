import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { SpotifyContextType } from "~/types";
import { supabase } from "~/utils/supabase";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const SpotifyContext = createContext<null | SpotifyContextType>(null);

export const SpotifyProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID!,
            scopes: [
                "user-read-email",
                "user-read-private",
                "user-read-playback-state",
                "user-modify-playback-state",
                "streaming",
                "playlist-read-private",
                "playlist-read-collaborative",
            ],
            usePKCE: true,
            redirectUri: makeRedirectUri({
                scheme: "llamify",
            }),
        },
        discovery
    );

    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                const savedToken = await AsyncStorage.getItem("llamify_token");
                const savedUser = await AsyncStorage.getItem("llamify_user");

                if (savedToken) {
                    setToken(savedToken);
                }

                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch {}
        };

        loadStoredAuth();
    }, []);

    useEffect(() => {
        if (response?.type === "success") {
            const { code } = response.params;

            exchangeCodeForToken(code);
        }
    }, [response]);

    const exchangeCodeForToken = async (code: string) => {
        setLoading(true);

        try {
            const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `grant_type=authorization_code&code=${code}&redirect_uri=${makeRedirectUri({
                    scheme: "llamify",
                })}&client_id=${process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID}&code_verifier=${request?.codeVerifier}`,
            });

            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;

            if (accessToken) {
                setToken(accessToken);
                await AsyncStorage.setItem("llamify_token", accessToken);

                const userResponse = await fetch("https://api.spotify.com/v1/me", {
                    headers: {
                        Authorization: `Bearer ${tokenData.access_token}`,
                    },
                });

                const userData = await userResponse.json();

                setUser(userData);
                await AsyncStorage.setItem("llamify_user", JSON.stringify(userData));

                await supabase.from("users").upsert({ id: userData.id });
            }
        } catch (error) {
            console.error("Token exchange failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const value = { isAuthenticated: !!token, loading, request, promptAsync, token, user };

    return <SpotifyContext.Provider value={value}>{children}</SpotifyContext.Provider>;
};

export const useSpotify = () => {
    const context = useContext(SpotifyContext);

    if (!context) {
        throw new Error("useSpotify must be used within SpotifyProvider");
    }

    return context;
};
