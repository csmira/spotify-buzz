import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import useAudio from '../../hooks/useAudio';
import CircularAudioSpectrum from './CircularAudioSpectrum';
import TimerBar from '../TimerBar';
import TrackCard from './TrackCard';
import * as incorrectAnimation from '../../assets/lottie/x.json';
import * as correctAnimation from '../../assets/lottie/checkmark.json';
import LottieAnimation from '../LottieAnimation';
import PrimaryButton from '../PrimaryButton';
import { ReactComponent as PlayArrowIcon } from '../../assets/icons/play-arrow.svg';

const ROUND_TIME_SECONDS = 15;

interface Props {
    trackChoices: Track[];
    correctTrack: Track;
    onRoundFinished: (isCorrectAnswer: boolean) => void;
}

const GameRound = ({ trackChoices, correctTrack, onRoundFinished }: Props) => {
    const [inProgress, setInProgress] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isTimerBarPaused, setIsTimerBarPaused] = useState(false);
    const [feedbackAnimation, setFeedbackAnimation] = useState<any>(correctAnimation);
    const { play, stop, audioFrequencyData, isAllowedToPlay, initializeAudioNodes } = useAudio();

    const handleTrackCardClick = (selectedTrack: Track) => {
        if (!inProgress) {
            return;
        }

        stop();
        if (selectedTrack.id === correctTrack.id) {
            setFeedbackAnimation(correctAnimation);
        } else {
            setFeedbackAnimation(incorrectAnimation);
            setIsTimerBarPaused(true);
        }
        setInProgress(false);
    };

    const handleGameTimerEnd = () => {
        stop();
        setFeedbackAnimation(incorrectAnimation);
        setIsTimerBarPaused(true);
        setInProgress(false);
    };

    const handleAnimationFinished = () => onRoundFinished(feedbackAnimation === correctAnimation);

    useEffect(() => {
        if (isAllowedToPlay) {
            setIsLoading(true);
            play(correctTrack.previewUrl, ROUND_TIME_SECONDS, () => {
                setIsTimerBarPaused(false);
                setInProgress(true);
                setIsLoading(false);
            });
        }
    }, [correctTrack, isAllowedToPlay]);

    return (
        <div className="flex h-full w-full flex-col">
            <TimerBar
                maxTime={ROUND_TIME_SECONDS}
                onTimeEnd={handleGameTimerEnd}
                className="mt-4 w-full"
                isPaused={isTimerBarPaused}
                isStopped={!inProgress && !isTimerBarPaused}
            />
            <div className="flex flex-grow items-center justify-center">
                {!isAllowedToPlay && (
                    <motion.div exit={{ opacity: 0 }}>
                        <PrimaryButton
                            onClick={initializeAudioNodes}
                            className="flex h-40 w-40 items-center justify-center"
                        >
                            <PlayArrowIcon className="ml-3 fill-light" />
                        </PrimaryButton>
                    </motion.div>
                )}
                {(inProgress || isLoading) && isAllowedToPlay && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <CircularAudioSpectrum frequencyData={audioFrequencyData} />
                    </motion.div>
                )}
                {!inProgress && isAllowedToPlay && !isLoading && (
                    <motion.div exit={{ opacity: 0 }}>
                        <LottieAnimation
                            onFinished={handleAnimationFinished}
                            animation={feedbackAnimation}
                            className="h-48 w-48"
                        />
                    </motion.div>
                )}
            </div>
            <div className="mt-auto mb-4 grid grid-cols-2 grid-rows-2 gap-3">
                {trackChoices.map((track) => (
                    <motion.div layoutId={track.id} key={track.id}>
                        <TrackCard track={track} onClick={() => handleTrackCardClick(track)} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GameRound;
