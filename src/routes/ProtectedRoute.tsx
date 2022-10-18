import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import LoaderFullScreen from '../components/LoaderFullScreen';
import { SpotifyAuthorizationContext } from '../components/SpotifyAuthorizationProvider';
import paths from './paths';

interface Props {
    children: JSX.Element;
}
const ProtectedRoute = ({ children }: Props) => {
    const { isAuthenticated, isLoading } = useContext(SpotifyAuthorizationContext);

    if (isLoading) {
        return <LoaderFullScreen />;
    }

    if (!isAuthenticated && !isLoading) {
        return <Navigate to={paths.LANDING} />;
    }

    return children;
};

export default ProtectedRoute;
