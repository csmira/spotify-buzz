import React, { forwardRef } from 'react';

interface Props {
    track: Track;
    onClick?: () => void;
}
const TrackCard = forwardRef<HTMLButtonElement, Props>(({ track, onClick }, ref) => {
    return (
        <button type="button" className="relative" onClick={onClick} ref={ref}>
            <img className="h-full w-full rounded-lg" alt="album cover" src={track.image} />
            <div className="absolute bottom-0 flex w-full flex-col items-start rounded-b-lg bg-dark/60 p-2">
                <p className="text-regular w-max-full text-left font-medium line-clamp-1">{track.name}</p>
                <p className="text-small mt-0.5 text-left line-clamp-1">{`By ${track.artistNames.join(', ')}`}</p>
            </div>
        </button>
    );
});

export default TrackCard;
