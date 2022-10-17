import React from 'react';
import Lottie from 'react-lottie';

interface Props {
    onFinished: () => void;
    animation: any;
    className?: string;
}
const LottieAnimation = ({ onFinished, animation, className }: Props) => {
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: 'none',
        },
    };
    return (
        <div className={className}>
            <Lottie
                options={defaultOptions}
                eventListeners={[
                    {
                        eventName: 'complete',
                        callback: onFinished,
                    },
                ]}
            />
        </div>
    );
};

export default LottieAnimation;
