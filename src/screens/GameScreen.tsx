import React, { useContext, useEffect } from 'react';
import getUserSavedTracks from '../api/track';
import { SpotifyAuthorizationContext } from '../components/SpotifyAuthorizationProvider';

const GameScreen = () => {
    const { isAuthenticated } = useContext(SpotifyAuthorizationContext);

    useEffect(() => {
        if (isAuthenticated) {
            getUserSavedTracks(0);
        }
    }, [isAuthenticated]);
    return <div className="full-screen-gradient-background">Game</div>;
};

export default GameScreen;
