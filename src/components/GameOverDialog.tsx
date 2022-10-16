import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PrimaryButton from './PrimaryButton';

interface Props {
    track: Track;
    totalCorrectTracks: number;
    onPlayAgain: () => void;
    open: boolean;
}
const GameOverDialog = ({ track, totalCorrectTracks, onPlayAgain, open }: Props) => {
    const handlePlayAgainButtonClick = () => {
        if (onPlayAgain) {
            onPlayAgain();
        }
    };

    if (!open) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                className="flex flex-col items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <h1 className="title-1 text-center font-bold">
                    {totalCorrectTracks === 1
                        ? `You guessed 1 song correctly`
                        : `You guessed ${totalCorrectTracks} songs correctly`}
                </h1>
                <h2 className="title-3 mt-6">The last song was</h2>
                <motion.img
                    layoutId={track.id}
                    className="mt-2 h-40 w-40 rounded-lg"
                    alt="ablum cover"
                    src={track.image}
                />
                <p className="text-regular mt-2 text-center">{track.name}</p>
                <p className="text-small mt-1 text-center">{`By ${track.artistNames.join(', ')}`}</p>
                <PrimaryButton className="mt-8" onClick={handlePlayAgainButtonClick}>
                    Play again?
                </PrimaryButton>
            </motion.div>
        </AnimatePresence>
    );
};

export default GameOverDialog;
