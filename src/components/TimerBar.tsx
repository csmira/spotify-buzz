import { motion, useAnimationControls } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { ReactComponent as TimerIcon } from '../assets/icons/timer.svg';

const variants = {
    continue: (time: number) => ({
        x: '-100%',
        transition: {
            ease: 'linear',
            duration: time,
        },
    }),
    reset: {
        x: '0%',
        transition: { ease: 'linear', duration: 1 },
    },
};

interface Props {
    maxTime: number;
    onTimeEnd: () => void;
    className?: string;
    isPaused?: boolean;
    isStopped?: boolean;
}
const TimerBar = ({ className, maxTime, isPaused, isStopped, onTimeEnd }: Props) => {
    const [timeRemaining, setTimeRemaining] = useState(maxTime);
    const animationControls = useAnimationControls();
    const timerRef = useRef<NodeJS.Timer>();

    useEffect(() => {
        if (timeRemaining <= 0) {
            onTimeEnd();
            clearInterval(timerRef.current);
        }
    }, [timeRemaining]);

    useEffect(() => {
        if (isPaused) {
            animationControls.stop();
            clearInterval(timerRef.current);
        } else {
            timerRef.current = setInterval(() => {
                setTimeRemaining((previousTime) => previousTime - 1);
            }, 1000);
            animationControls.start(variants.continue(timeRemaining + 1));
        }

        if (isStopped) {
            clearInterval(timerRef.current);
            animationControls.start(variants.reset);
            setTimeRemaining(maxTime);
        }

        return () => {
            clearInterval(timerRef.current);
        };
    }, [isPaused, isStopped]);

    return (
        <div
            className={cn(
                'relative flex items-center justify-center overflow-hidden rounded-full border border-primary px-2 py-1',
                className
            )}
        >
            <span className="title-2 grow-1 z-10 font-semibold">{timeRemaining}</span>
            <TimerIcon className="absolute right-2 z-10 mt-px" width={20} height={20} />
            <motion.div
                initial={{ x: '0%' }}
                animate={animationControls}
                className="absolute left-0 h-full w-full bg-gradient-to-r from-secondary to-primary"
            />
        </div>
    );
};

export default TimerBar;
