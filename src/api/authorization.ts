import axios from 'axios';
import {
    createUrl,
    generateCodeChallenge,
    generateRandomStringInRangeInclusive,
    setCodeVerifier,
    snakeCaseToCamelCaseObject,
} from '../util';

export type AccessTokenResponse = {
    accessToken: AccessToken;
    expiresIn: number;
    refreshToken: RefreshToken;
};

const CLIENT_ID = `${process.env.REACT_APP_CLIENT_ID}`;
const REDIRECT_URI = `${window.location.origin}/game`;
const spotifyAuthorizationUrl = (endpoint: string) => `https://accounts.spotify.com${endpoint}`;

export const redirectToSpotifyAuthorization = (): void => {
    const codeVerifier = generateRandomStringInRangeInclusive(43, 128);
    setCodeVerifier(codeVerifier);
    const codeChallenge = generateCodeChallenge(codeVerifier);

    const url = createUrl(spotifyAuthorizationUrl('/authorize'), {
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: 'user-library-read',
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
    });

    window.location.href = url.toString();
};

export const getAccessToken = async (codeVerifier: string, accessCode: string): Promise<AccessTokenResponse> => {
    const formUrlEncodedData = new URLSearchParams({
        code: accessCode,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: codeVerifier,
    });
    const response = await axios.post(spotifyAuthorizationUrl('/api/token'), formUrlEncodedData);
    const { accessToken, expiresIn, refreshToken } = snakeCaseToCamelCaseObject(response.data);

    return { accessToken, expiresIn, refreshToken };
};

export const getRefreshedAccessToken = async (refreshToken: RefreshToken): Promise<AccessTokenResponse> => {
    const formUrlEncodedData = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        refresh_token: refreshToken,
    });
    const response = await axios.post(spotifyAuthorizationUrl('/api/token'), formUrlEncodedData);
    const { accessToken, expiresIn, refreshToken: updatedRefreshToken } = snakeCaseToCamelCaseObject(response.data);
    return { accessToken, expiresIn, refreshToken: updatedRefreshToken };
};
