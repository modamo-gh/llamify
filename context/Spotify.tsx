import {
  AuthRequestPromptOptions,
  AuthSessionResult,
  makeRedirectUri,
  useAuthRequest,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

type SpotifyContextType = {
  request: any;
  promptAsync: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>;
  token: string | null;
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
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
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'streaming',
        'playlist-read-private',
        'playlist-read-collaborative',
      ],
      usePKCE: false,
      redirectUri: makeRedirectUri({
        scheme: 'llamify',
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      exchangeCodeForToken(code);
    }
  }, [response]);

  const exchangeCodeForToken = async (code: string) => {
    setLoading(true);

    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${makeRedirectUri({
          scheme: 'llamify',
        })}&client_id=${process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID}&client_secret=${process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET}`,
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.access_token) {
        setToken(tokenData.access_token);

        const userResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        const userData = await userResponse.json();

        setUser(userData);
      }
    } catch (error) {
      console.error('Token exchange failed:', error);
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
    throw new Error('useSpotify must be used within SpotifyProvider');
  }

  return context;
};
