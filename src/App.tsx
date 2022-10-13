import React from 'react';
import { RouterProvider } from 'react-router-dom';
import SpotifyAuthorization from './components/SpotifyAuthorization';
import Router from './routes/Router';

const App = () => {
    return (
        <SpotifyAuthorization>
            <RouterProvider router={Router} />
        </SpotifyAuthorization>
    );
};

export default App;
