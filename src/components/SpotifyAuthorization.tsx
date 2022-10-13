import { useEffect } from 'react';
import { getAccessToken } from '../api/authorization';
import { setSpotifyApiAccessToken } from '../api/spotifyApi';
import { getCodeVerifier, setRefreshToken } from '../util';

interface Props {
    children: JSX.Element;
}
const SpotifyAuthorization = ({ children }: Props) => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlSearchParams.get('code');

    const codeVerifier = getCodeVerifier();

    useEffect(() => {
        const setupAuthorization = async () => {
            if (authorizationCode && codeVerifier) {
                try {
                    const { accessToken, refreshToken } = await getAccessToken(codeVerifier, authorizationCode);
                    setSpotifyApiAccessToken(accessToken);
                    setRefreshToken(refreshToken);
                } catch (error) {
                    // show error
                    console.log(error);
                }
            } else {
                // show error
            }
        };
        setupAuthorization();
    }, []);

    return children;
};

export default SpotifyAuthorization;
