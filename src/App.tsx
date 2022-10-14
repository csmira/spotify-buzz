import React from 'react';
import { RouterProvider } from 'react-router-dom';
import SpotifyAuthorizationProvider from './components/SpotifyAuthorizationProvider';
import Router from './routes/Router';

const App = () => {
    return (
        <SpotifyAuthorizationProvider>
            <RouterProvider router={Router} />
        </SpotifyAuthorizationProvider>
    );
};

export default App;
