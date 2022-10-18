import { motion } from 'framer-motion';
import React from 'react';
import cn from 'classnames';
import LottieAnimation from './LottieAnimation';
import * as loadingAnimation from '../assets/lottie/loading-dots.json';

interface Props {
    className?: string;
}

const Loader = ({ className }: Props) => {
    return (
        <motion.div
            className={cn('flex h-40 w-40 items-center justify-around rounded-full bg-secondary p-6', className)}
        >
            <LottieAnimation animation={loadingAnimation} loop />
        </motion.div>
    );
};

export default Loader;
