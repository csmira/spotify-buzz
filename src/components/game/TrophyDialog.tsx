import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PrimaryButton from '../PrimaryButton';
import LottieAnimation from '../LottieAnimation';
import * as trophyAnimation from '../../assets/lottie/trophy.json';

interface Props {
    totalCorrectTracks: number;
    onPlayAgain: () => void;
    open: boolean;
}
const TrophyDialog = ({ onPlayAgain, totalCorrectTracks, open }: Props) => {
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
                <h1 className="title-1 text-center font-bold">Congratulations</h1>
                <p className="title-3 mt-4 text-center">{`You guessed all ${totalCorrectTracks} songs correctly`}</p>
                <LottieAnimation animation={trophyAnimation} />
                <PrimaryButton className="mt-8" onClick={handlePlayAgainButtonClick}>
                    Play again
                </PrimaryButton>
            </motion.div>
        </AnimatePresence>
    );
};

export default TrophyDialog;
