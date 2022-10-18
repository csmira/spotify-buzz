import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { redirectToSpotifyAuthorization } from '../api/authorization';
import PrimaryButton from '../components/PrimaryButton';
import { SpotifyAuthorizationContext } from '../components/SpotifyAuthorizationProvider';
import paths from '../routes/paths';

const LandingScreen = () => {
    const { isAuthenticated, isLoading } = useContext(SpotifyAuthorizationContext);
    const navigate = useNavigate();

    const onGetStartedButtonClick = () => {
        if (!isLoading && isAuthenticated) {
            navigate(paths.GAME);
        } else {
            redirectToSpotifyAuthorization();
        }
    };

    return (
        <div className="full-screen-gradient-background flex flex-col items-center justify-center text-center">
            <h1 className="title-1 font-serif">Spotify Buzz</h1>
            <h2 className="title-2 mt-4">How well do you know your favorite songs?</h2>
            <p className="text-regular mt-5">Connect your spotify account</p>
            <p className="text-regular mt-1">Guess each song in under 15 seconds</p>
            <PrimaryButton className="mt-8" onClick={onGetStartedButtonClick}>
                Get started
            </PrimaryButton>
        </div>
    );
};

export default LandingScreen;
