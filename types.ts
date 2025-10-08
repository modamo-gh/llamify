import { AuthRequestPromptOptions, AuthSessionResult } from "expo-auth-session";

export type ListContextType = {
    addToList: (item: SpotifyItem, list: "later" | "today") => Promise<void>;
    listenLater: SpotifyItem[];
    listenToday: SpotifyItem[];
    removeFromList: (item: SpotifyItem, list: "later" | "today") => Promise<void>;
};

export type Mode = "" | "filter" | "prompt" | "sort";

export type SpotifyContextType = {
    isAuthenticated: boolean;
    loading: boolean;
    promptAsync: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>;
    refreshAccessToken: () => Promise<void>;
    request: any;
    token: string | null;
    user: any;
};

export type SpotifyItem = {
    createdAt: Date;
    imageURL: string;
    list: "later" | "today";
    name: string;
    type: string;
    uri: string;
};
