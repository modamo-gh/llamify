import { AuthRequestPromptOptions, AuthSessionResult } from "expo-auth-session";

export type ListContextType = {addToList: (item: SpotifyItem, list: "later" | "today") => Promise<void>}

export type SpotifyContextType = {
    request: any;
    promptAsync: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>;
    token: string | null;
    isAuthenticated: boolean;
    user: any;
    loading: boolean;
};

export type SpotifyItem = {
    imageURL: string;
    name: string;
    type: string;
    uri: string;
};
