import React, { forwardRef } from 'react';
import cn from 'classnames';

interface Props {
    children: React.ReactNode;
    className?: string;
    onClick: () => void;
}

const PrimaryButton = forwardRef<HTMLButtonElement, Props>(
    ({ children, className = '', onClick }: React.HTMLProps<HTMLButtonElement>, ref) => {
        return (
            <button
                type="button"
                ref={ref}
                className={cn('rounded-full bg-primary py-4 px-8', className)}
                onClick={onClick}
            >
                {children}
            </button>
        );
    }
);

export default PrimaryButton;
