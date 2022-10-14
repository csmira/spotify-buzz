import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import GameScreen from '../screens/GameScreen';
import LandingScreen from '../screens/LandingScreen';
import paths from './paths';

const Router = createBrowserRouter([
    {
        path: paths.LANDING,
        element: <LandingScreen />,
    },
    {
        path: paths.GAME,
        element: <GameScreen />,
    },
]);

export default Router;
