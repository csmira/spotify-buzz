import React, { createContext, useEffect, useMemo, useState } from 'react';
import { AccessTokenResponse, getAccessToken, getRefreshedAccessToken } from '../api/authorization';
import { setSpotifyApiAccessToken, setSpotifyApiAuthorizationInterceptor } from '../api/spotifyApi';
import {
    getCodeVerifier,
    getRefreshTokenFromStorage,
    removeRefreshTokenFromStorage,
    setRefreshTokenInStorage,
} from '../util';

export const SpotifyAuthorizationContext = createContext({
    isAuthenticated: false,
    isLoading: false,
});

interface Props {
    children: JSX.Element;
}

const SpotifyAuthorizationProvider = ({ children }: Props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [refreshToken, setRefreshToken] = useState<RefreshToken | null>(getRefreshTokenFromStorage());
    const context = useMemo(() => ({ isAuthenticated, isLoading }), [isAuthenticated, isLoading]);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlSearchParams.get('code');
    const error = urlSearchParams.get('error');

    const codeVerifier = getCodeVerifier();

    const setAccessAndRefreshTokens = async (getAccessAndRefreshTokens: () => Promise<AccessTokenResponse>) => {
        try {
            const { accessToken, refreshToken: updatedRefreshToken } = await getAccessAndRefreshTokens();
            setSpotifyApiAccessToken(accessToken);
            setRefreshToken(updatedRefreshToken);
            setRefreshTokenInStorage(updatedRefreshToken);
            setIsAuthenticated(true);
            return refreshToken;
        } catch (ex) {
            setIsAuthenticated(false);
            removeRefreshTokenFromStorage();
            return null;
        }
    };

    const setupInitialAuthorization = async () => {
        setIsLoading(true);

        if (refreshToken) {
            await setAccessAndRefreshTokens(() => getRefreshedAccessToken(refreshToken));
        } else if (authorizationCode && codeVerifier) {
            await setAccessAndRefreshTokens(() => getAccessToken(codeVerifier, authorizationCode));
            window.history.replaceState({}, '', window.location.origin + window.location.pathname);
        } else if (error) {
            setIsAuthenticated(false);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setupInitialAuthorization();
        }
    }, []);

    useEffect(() => {
        if (refreshToken) {
            setSpotifyApiAuthorizationInterceptor(() =>
                setAccessAndRefreshTokens(() => getRefreshedAccessToken(refreshToken))
            );
        }
    }, [refreshToken]);

    return <SpotifyAuthorizationContext.Provider value={context}>{children}</SpotifyAuthorizationContext.Provider>;
};

export default SpotifyAuthorizationProvider;
