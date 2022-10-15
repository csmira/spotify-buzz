import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import cn from 'classnames';
import { reduceFrequencyDomainByHalf, trimFrequencyDomainEnd } from '../util';

const MAX_SCALE_ANIMATION = 0.3;
const FREQUENCY_RANGE = 20;

interface Props {
    /** Array must have a length between 2^5 and 2^15 */
    frequencyData: Uint8Array;
    className?: string;
}
const CircularAudioSpectrum = ({ frequencyData, className }: Props) => {
    const reduceFrequencyData = (data: Uint8Array) => reduceFrequencyDomainByHalf(trimFrequencyDomainEnd(data));
    const [previousFrequencyData, setPreviousFrequencyData] = useState<Uint8Array>(reduceFrequencyData(frequencyData));
    const [frequencyDifference, setFrequencyDifference] = useState<number[]>(
        Array.from(reduceFrequencyData(frequencyData))
    );
    const frequencyDifferenceToScaleAnimation = (value: number) =>
        1 + Math.max(Math.min(value / FREQUENCY_RANGE, MAX_SCALE_ANIMATION), -MAX_SCALE_ANIMATION);

    useEffect(() => {
        const reducedFrequencyData = reduceFrequencyData(frequencyData);
        const newFrequencyDifference = Array.from(reducedFrequencyData).map(
            (value, index) => value - previousFrequencyData[index]
        );
        setFrequencyDifference(newFrequencyDifference);
        setPreviousFrequencyData(reducedFrequencyData);
    }, [frequencyData]);

    return (
        <div
            className={cn(
                'justify flex h-40 w-40 items-center justify-around rounded-full bg-secondary p-8',
                className
            )}
        >
            {frequencyDifference.map((value, index) => (
                <motion.div
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className="h-[60%] w-[8%] rounded-full bg-light"
                    initial={{ scaleY: 1 }}
                    animate={{
                        scaleY: frequencyDifferenceToScaleAnimation(value),
                    }}
                />
            ))}
        </div>
    );
};

export default CircularAudioSpectrum;
