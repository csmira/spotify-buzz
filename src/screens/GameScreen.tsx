import React, { useCallback, useContext, useEffect, useState } from 'react';
import getUserSavedTracks from '../api/track';
import GameOverDialog from '../components/game/GameOverDialog';
import GameRound from '../components/game/GameRound';
import PrimaryButton from '../components/PrimaryButton';
import { SpotifyAuthorizationContext } from '../components/SpotifyAuthorizationProvider';
import useAudio from '../hooks/useAudio';
import { getRandomElementFromArray, shuffleArray } from '../util';

const GameScreen = () => {
    const { isAuthenticated } = useContext(SpotifyAuthorizationContext);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
    const [correctTrack, setCorrectTrack] = useState<Track | null>(null!);
    const [tracksOffset, setTracksOffset] = useState(0);
    const [correctlyGuessedTracks, setCorrectlyGuessedTracks] = useState<Track[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const { initializeAudioNodes, isAllowedToPlay } = useAudio();

    const fetchNextTracks = useCallback(async () => {
        try {
            const { tracks: newTracks, hasMore } = await getUserSavedTracks(tracksOffset);
            if (hasMore) {
                setTracksOffset((previousOffset) => previousOffset + 50);
            }
            return newTracks;
        } catch (error) {
            console.log(error);
            // TODO handle error
        }
        return [];
    }, [tracksOffset]);

    const setupNextRound = (currentTracks: Track[]) => {
        const tracksWithoutCorrectTrack = currentTracks.filter((track) => track.id !== correctTrack?.id);
        const nextSelectedTracks = shuffleArray(tracksWithoutCorrectTrack).slice(0, 4);
        const nextCorrectAnswer = getRandomElementFromArray(nextSelectedTracks);

        setTracks(tracksWithoutCorrectTrack);
        setSelectedTracks(nextSelectedTracks);
        setCorrectTrack(nextCorrectAnswer);
    };

    const restartGame = () => {
        const combinedTracks = [...tracks, ...correctlyGuessedTracks];
        setupNextRound(combinedTracks);
        setIsGameOver(false);
        setCorrectlyGuessedTracks([]);
    };

    const handleRoundFinished = (isCorrectAnswer: boolean) => {
        if (isCorrectAnswer) {
            if (correctTrack) {
                setCorrectlyGuessedTracks([...correctlyGuessedTracks, correctTrack]);
            }
            setupNextRound(tracks);
        } else {
            setIsGameOver(true);
        }
    };

    useEffect(() => {
        const setupInitalGame = async () => {
            const newTracks = await fetchNextTracks();
            setupNextRound(newTracks);
        };
        if (isAuthenticated) {
            setupInitalGame();
        }
    }, [isAuthenticated]);

    if (!correctTrack) {
        // TODO: handle loading state or when user doesn't have any tracks
        return <div>loading</div>;
    }

    if (!isAllowedToPlay) {
        // TODO: handle audio context creation from user event
        return <PrimaryButton onClick={initializeAudioNodes}>Initialize Nodes</PrimaryButton>;
    }

    return (
        <div className="full-screen-gradient-background flex flex-col items-center justify-center px-6">
            {!isGameOver && (
                <GameRound
                    correctTrack={correctTrack}
                    trackChoices={selectedTracks}
                    onRoundFinished={handleRoundFinished}
                />
            )}
            <GameOverDialog
                open={isGameOver}
                track={correctTrack}
                onPlayAgain={restartGame}
                totalCorrectTracks={correctlyGuessedTracks.length}
            />
        </div>
    );
};

export default GameScreen;
