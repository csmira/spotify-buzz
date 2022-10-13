import React from 'react';
import { redirectToSpotifyAuthorization } from '../api/authorization';
import PrimaryButton from '../components/PrimaryButton';

const LandingScreen = () => {
    return (
        <div className="full-screen-gradient-background flex flex-col items-center justify-center text-center">
            <h1 className="title-1 font-serif">Spotify Buzz</h1>
            <h2 className="title-2 mt-4">How well do you know your favorite songs?</h2>
            <p className="text-regular mt-5">Connect your spotify account</p>
            <p className="text-regular mt-1">Guess each song in under 15 seconds</p>
            <PrimaryButton className="mt-8" onClick={redirectToSpotifyAuthorization}>
                Get started
            </PrimaryButton>
        </div>
    );
};

export default LandingScreen;
