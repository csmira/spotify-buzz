import axios from 'axios';
import {
    createUrl,
    generateCodeChallenge,
    generateRandomStringInRangeInclusive,
    setCodeVerifier,
    snakeCaseToCamelCaseObject,
} from '../util';

type AccessTokenResponse = {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
};

const CLIENT_ID = '3319ea2c185a4f3d9d8ae366a9e968c9';
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

export const getRefreshedAccessToken = async (refreshToken: string): Promise<AccessTokenResponse> => {
    const formUrlEncodedData = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        refresh_token: refreshToken,
    });
    const response = await axios.post(spotifyAuthorizationUrl('/api/token'), formUrlEncodedData);
    const { accessToken, expiresIn } = snakeCaseToCamelCaseObject(response.data);
    return { accessToken, expiresIn, refreshToken };
};
