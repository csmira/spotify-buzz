import React, { useCallback, useEffect, useState } from 'react';
import getUserSavedTracks from '../api/track';
import GameOverDialog from '../components/game/GameOverDialog';
import GameRound from '../components/game/GameRound';
import TrophyDialog from '../components/game/TrophyDialog';
import LoaderFullScreen from '../components/LoaderFullScreen';
import { getRandomElementFromArray, shuffleArray } from '../util';

const TRACK_FETCH_LIMIT = 50;
const SELECTED_TRACKS_AMOUNT = 4;

const GameScreen = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
    const [correctTrack, setCorrectTrack] = useState<Track | null>(null);
    const [tracksOffset, setTracksOffset] = useState(0);
    const [hasMoreTracks, setHasMoreTracks] = useState(true);
    const [correctlyGuessedTracks, setCorrectlyGuessedTracks] = useState<Track[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);

    const fetchMoreTracks = useCallback(async () => {
        if (!hasMoreTracks) {
            return [];
        }

        try {
            const { tracks: newTracks, hasMore } = await getUserSavedTracks(tracksOffset, TRACK_FETCH_LIMIT);
            if (hasMore) {
                setTracksOffset((previousOffset) => previousOffset + TRACK_FETCH_LIMIT);
            }
            setHasMoreTracks(hasMore);
            return newTracks;
        } catch (error) {
            console.log(error);
            // TODO handle error
        }
        return [];
    }, [tracksOffset, hasMoreTracks]);

    const setupNextRound = (currentTracks: Track[], previousCorrectTrack: Track | null) => {
        let nextSelectedTracks: Track[];
        let nextCorrectAnswer: Track;
        const tracksWithoutCorrectTrack = currentTracks.filter((track) => track.id !== previousCorrectTrack?.id);

        // Use previously guessed tracks to fill up remaining space so we always show 4 tracks
        if (tracksWithoutCorrectTrack.length < SELECTED_TRACKS_AMOUNT) {
            const reusedTracksCount = SELECTED_TRACKS_AMOUNT - tracksWithoutCorrectTrack.length;
            nextSelectedTracks = shuffleArray([
                ...tracksWithoutCorrectTrack,
                ...correctlyGuessedTracks.slice(0, reusedTracksCount),
            ]);
            nextCorrectAnswer = getRandomElementFromArray(tracksWithoutCorrectTrack);
        } else {
            nextSelectedTracks = shuffleArray(tracksWithoutCorrectTrack).slice(0, 4);
            nextCorrectAnswer = getRandomElementFromArray(nextSelectedTracks);
        }

        setTracks(tracksWithoutCorrectTrack);
        setSelectedTracks(nextSelectedTracks);
        setCorrectTrack(nextCorrectAnswer);
    };

    const restartGame = () => {
        const combinedTracks = [...tracks, ...correctlyGuessedTracks];
        setCorrectTrack(null);
        setupNextRound(combinedTracks, null);
        setIsGameOver(false);
        setCorrectlyGuessedTracks([]);
    };

    const handleRoundFinished = async (isCorrectAnswer: boolean) => {
        if (isCorrectAnswer && correctTrack) {
            setCorrectlyGuessedTracks([...correctlyGuessedTracks, correctTrack]);

            if (tracks.length === 1) {
                setIsGameOver(true);
                setTracks([]);
            } else {
                setupNextRound(tracks, correctTrack);
            }

            if (tracks.length < 10) {
                const fetchedTracks = await fetchMoreTracks();
                setTracks((previousTracks) => [...previousTracks, ...fetchedTracks]);
            }
        } else {
            setIsGameOver(true);
        }
    };

    useEffect(() => {
        const setupInitalGame = async () => {
            const newTracks = await fetchMoreTracks();
            setupNextRound(newTracks, null);
        };
        setupInitalGame();
    }, []);

    if (!correctTrack) {
        return <LoaderFullScreen />;
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
                open={isGameOver && tracks.length > 0}
                track={correctTrack}
                onPlayAgain={restartGame}
                totalCorrectTracks={correctlyGuessedTracks.length}
            />
            <TrophyDialog
                open={isGameOver && tracks.length === 0}
                onPlayAgain={restartGame}
                totalCorrectTracks={correctlyGuessedTracks.length}
            />
        </div>
    );
};

export default GameScreen;
