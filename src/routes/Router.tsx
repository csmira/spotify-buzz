import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LandingScreen from '../screens/LandingScreen';
import paths from './paths';

const Router = createBrowserRouter([
    {
        path: paths.LANDING,
        element: <LandingScreen />,
    },
]);

export default Router;
