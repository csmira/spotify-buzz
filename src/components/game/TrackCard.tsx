import React, { forwardRef, useEffect, useState } from 'react';
import cn from 'classnames';

interface Props {
    track: Track;
    onClick?: () => void;
}
const TrackCard = forwardRef<HTMLButtonElement, Props>(({ track, onClick }, ref) => {
    const [showPlaceholder, setShowPlaceholder] = useState(true);

    useEffect(() => {
        const highResolutionImage = new Image();
        highResolutionImage.src = track.image;
        highResolutionImage.onload = () => setShowPlaceholder(false);
    }, []);

    return (
        <button type="button" className="relative h-full w-full" onClick={onClick} ref={ref}>
            <img
                className={cn('h-full w-full rounded-lg', {
                    'blur-[2px]': showPlaceholder,
                })}
                alt="album cover"
                src={showPlaceholder ? track.placeholderImage : track.image}
            />
            <div className="absolute bottom-0 flex w-full flex-col items-start rounded-b-lg bg-dark/60 p-2">
                <p className="text-regular w-max-full text-left font-medium line-clamp-1">{track.name}</p>
                <p className="text-small mt-0.5 text-left line-clamp-1">{`By ${track.artistNames.join(', ')}`}</p>
            </div>
        </button>
    );
});

export default TrackCard;
