import axios, { AxiosError, AxiosResponse } from 'axios';

const spotifyApi = axios.create({
    baseURL: 'https://api.spotify.com/v1',
});

let authorizationInterceptor: number;

export const setSpotifyApiAccessToken = (accessToken: AccessToken) => {
    spotifyApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

export const setSpotifyApiAuthorizationInterceptor = (onAuthorizationRetry: () => Promise<RefreshToken | null>) => {
    spotifyApi.interceptors.response.clear();
    authorizationInterceptor = spotifyApi.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            const originalResponse = error.config;
            if (error.response?.status === 401 && originalResponse?.headers) {
                spotifyApi.interceptors.response.eject(authorizationInterceptor);

                // Reset headers to prevent conflicts when spotifyApi.defaults.headers.common is applied
                originalResponse.headers = {};
                const refreshToken = await onAuthorizationRetry();
                if (refreshToken) {
                    return spotifyApi(originalResponse);
                }
            }
            return Promise.reject(error);
        }
    );
};

export default spotifyApi;
