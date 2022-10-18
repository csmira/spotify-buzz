import React from 'react';
import Lottie from 'react-lottie';

interface Props {
    onFinished?: () => void;
    animation: any;
    className?: string;
    loop?: boolean;
}
const LottieAnimation = ({ onFinished, animation, className, loop }: Props) => {
    const defaultOptions = {
        loop: loop ?? false,
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
                eventListeners={
                    onFinished && [
                        {
                            eventName: 'complete',
                            callback: onFinished,
                        },
                    ]
                }
            />
        </div>
    );
};

export default LottieAnimation;
