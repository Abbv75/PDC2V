import { Stack } from '@mui/joy';
import { useCallback, useRef, useState } from 'react';

const CompassControl = () => {
    const dragHandleRef = useRef<HTMLDivElement>(null);

    // Use refs for drag state to avoid re-renders during drag
    const isDraggingRef = useRef(false);
    const startPosRef = useRef({ x: 0, y: 0 });
    const initialPosRef = useRef({ x: 330, y: 90 });

    // State for position
    const [position, setPosition] = useState({ x: 330, y: 90 });

    // Handle pointer down - start dragging
    const handlePointerDown = useCallback((event: React.PointerEvent) => {
        // Only handle left mouse button
        if (event.button !== 0) return;

        event.preventDefault();
        event.stopPropagation();

        const dragHandle = dragHandleRef.current;
        if (!dragHandle) return;

        // Capture pointer to this element
        dragHandle.setPointerCapture(event.pointerId);

        isDraggingRef.current = true;
        startPosRef.current = { x: event.clientX, y: event.clientY };
        initialPosRef.current = { ...position };
    }, [position]);

    // Handle pointer move - update position
    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        if (!isDraggingRef.current) return;

        event.preventDefault();
        event.stopPropagation();

        const deltaX = event.clientX - startPosRef.current.x;
        const deltaY = event.clientY - startPosRef.current.y;

        const newX = initialPosRef.current.x + deltaX;
        const newY = initialPosRef.current.y + deltaY;

        // Update position state for smooth dragging
        setPosition({ x: newX, y: newY });
    }, []);

    // Handle pointer up - stop dragging
    const handlePointerUp = useCallback((event: React.PointerEvent) => {
        if (!isDraggingRef.current) return;

        event.preventDefault();
        event.stopPropagation();

        const dragHandle = dragHandleRef.current;
        if (dragHandle) {
            dragHandle.releasePointerCapture(event.pointerId);
        }

        isDraggingRef.current = false;
    }, []);

    return (
        <Stack
            ref={dragHandleRef}
            component={'div'}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerUp}
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
                zIndex: 1000,
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDraggingRef.current ? 'grabbing' : 'pointer',
                userSelect: 'none',
                touchAction: 'none',
            }}
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