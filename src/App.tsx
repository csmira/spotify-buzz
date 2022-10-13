import React from 'react';
import { redirectToSpotifyAuthorization } from './api/authorization';
import SpotifyAuthorization from './components/SpotifyAuthorization';

const App = () => {
    /*
    ()
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        console.log(searchParams.get('code'));
        const accessCode = searchParams.get('code');
        const error = searchParams.get('code');
        if (!accessCode && !error) {
            console.log();
            const codeVerifier = generateRandomStringInRangeInclusive(43, 128);
            localStorage.setItem('codeVerifier', codeVerifier);
            setTimeout(() => redirectToSpotifyAuthorization(codeVerifier), 2000);
        } else {
            const codeVerifier = localStorage.getItem('codeVerifier') || 'test';
            const code = searchParams.get('code') || 'test';
            getAccessToken(codeVerifier, code);
        }
    }, []);
    */
    return (
        <SpotifyAuthorization>
            <button type="button" onClick={redirectToSpotifyAuthorization}>
                Authorize
            </button>
        </SpotifyAuthorization>
    );
};

export default App;
