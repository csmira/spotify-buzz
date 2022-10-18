import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import GameScreen from '../screens/GameScreen';
import LandingScreen from '../screens/LandingScreen';
import paths from './paths';
import ProtectedRoute from './ProtectedRoute';

const Router = createBrowserRouter([
    {
        path: paths.LANDING,
        element: <LandingScreen />,
    },
    {
        path: paths.GAME,
        element: (
            <ProtectedRoute>
                <GameScreen />
            </ProtectedRoute>
        ),
    },
]);

export default Router;
