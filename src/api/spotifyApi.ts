import axios from 'axios';

const spotifyApi = axios.create({
    baseURL: 'https://api.spotify.com/v1',
});

export const setSpotifyApiAccessToken = (accessToken: string) => {
    spotifyApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

export default spotifyApi;
