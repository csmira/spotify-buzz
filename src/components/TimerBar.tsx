import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as TimerIcon } from '../icons/timer.svg';

interface Props {
    maxTime: number;
}
const TimerBar = ({ maxTime }: Props) => {
    const [timeRemaining, setTimeRemaining] = useState(maxTime);
    const timerRef = useRef<NodeJS.Timer>();

    useEffect(() => {
        if (timeRemaining <= 0) {
            clearInterval(timerRef.current);
        }
    }, [timeRemaining]);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeRemaining((previousTime) => previousTime - 1);
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div className="relative flex items-center justify-center overflow-hidden rounded-full border border-primary px-2 py-1">
            <span className="title-2 grow-1 z-10 font-semibold">{timeRemaining}</span>
            <TimerIcon className="absolute right-2 z-10 mt-px" width={20} height={20} />
            <motion.div
                initial={{ x: '0%' }}
                animate={{ x: '-100%', transition: { ease: 'linear', duration: maxTime } }}
                className="absolute left-0 h-full w-full bg-gradient-to-r from-secondary to-primary"
            />
        </div>
    );
};

export default TimerBar;
