import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from './Loader';

const LoaderFullScreen = () => {
    return (
        <AnimatePresence>
            <motion.div className="full-screen-gradient-background flex items-center justify-center">
                <Loader className="absolute top-[22%]" />
            </motion.div>
        </AnimatePresence>
    );
};
export default LoaderFullScreen;
