import spotifyApi from './spotifyApi';

type Track = {
    id: string;
    previewUrl: string;
    name: string;
    artistNames: string[];
    image: string;
};

type SavedTracksResponse = {
    tracks: Track[];
    hasMore: boolean;
};

const getUserSavedTracks = async (offset: number): Promise<SavedTracksResponse> => {
    const queryParameters = new URLSearchParams({
        offset: offset.toString(),
        limit: '50',
    });
    const response = await spotifyApi.get('/me/tracks', { params: queryParameters });

    const filteredTracks = response.data.items.filter((item: SpotifyApi.SavedTrackObject) => !item.track.preview_url);
    const mappedTracks = filteredTracks.map(({ track }: SpotifyApi.SavedTrackObject) => ({
        id: track.id,
        previewUrl: track.preview_url,
        name: track.name,
        artistNames: track.artists.map(({ name }: SpotifyApi.ArtistObjectSimplified) => name),
        image: track.album.images[0].url,
    }));

    return {
        tracks: mappedTracks,
        hasMore: response.data.next !== null,
    };
};

export default getUserSavedTracks;
