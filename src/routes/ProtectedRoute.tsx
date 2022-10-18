import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { SpotifyAuthorizationContext } from '../components/SpotifyAuthorizationProvider';
import paths from './paths';

interface Props {
    children: JSX.Element;
}
const ProtectedRoute = ({ children }: Props) => {
    const { isAuthenticated, isLoading } = useContext(SpotifyAuthorizationContext);

    if (isLoading) {
        // TODO: create loading screen
        return <div className="bg-red h-full w-full">loading auth</div>;
    }

    if (!isAuthenticated && !isLoading) {
        return <Navigate to={paths.LANDING} />;
    }

    return children;
};

export default ProtectedRoute;
