import React, { createContext, useEffect, useMemo, useState } from 'react';
import { getAccessToken } from '../api/authorization';
import { setSpotifyApiAccessToken } from '../api/spotifyApi';
import { getCodeVerifier, setRefreshToken } from '../util';

interface Props {
    children: JSX.Element;
}

export const SpotifyAuthorizationContext = createContext({
    isAuthenticated: false,
    isLoading: false,
});

const SpotifyAuthorizationProvider = ({ children }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const context = useMemo(() => ({ isAuthenticated, isLoading }), [isAuthenticated, isLoading]);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlSearchParams.get('code');

    const codeVerifier = getCodeVerifier();

    const setupAuthorization = async () => {
        if (authorizationCode && codeVerifier) {
            setIsLoading(true);
            try {
                const { accessToken, refreshToken } = await getAccessToken(codeVerifier, authorizationCode);
                setSpotifyApiAccessToken(accessToken);
                setIsAuthenticated(true);
                setRefreshToken(refreshToken);
            } catch (error) {
                // show error
                console.log(error);
            }
            setIsLoading(false);
        } else {
            // show error
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setupAuthorization();
        }
    }, []);

    return <SpotifyAuthorizationContext.Provider value={context}>{children}</SpotifyAuthorizationContext.Provider>;
};

export default SpotifyAuthorizationProvider;
