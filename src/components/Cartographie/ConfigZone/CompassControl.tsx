import { Stack } from '@mui/joy';
import { useCallback, useRef, useState } from 'react';

const CompassControl = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 90 });

    const offset = useRef({ x: 0, y: 0 });

    const handleMouseDown = useCallback((event: any) => {
        event.stopPropagation();
        setIsDragging(true);
        offset.current = {
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        };
    }, [position]);

    const handleMouseMove = useCallback((event: any) => {
        if (!isDragging) return;
        event.stopPropagation();
        setPosition({
            x: event.clientX - offset.current.x,
            y: event.clientY - offset.current.y,
        });
    }, [isDragging]);

    const handleMouseUp = useCallback((event: any) => {
        event.stopPropagation();
        setIsDragging(false);
    }, []);

    return (
        <Stack
            sx={{
                position: "fixed",
                top: 80,
                left: 10,
                width: 20,
                height: 20,
                p: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '50%',
                border: '2px solid #333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // pointerEvents: 'none',
                zIndex: 1000,
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'pointer',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#333"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polygon points="12 2 19 21 12 17 5 21 12 2" />
            </svg>
        </Stack>
    );
};

export default CompassControl;
