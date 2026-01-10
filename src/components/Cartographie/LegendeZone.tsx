import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Card, Stack, Tooltip, Typography } from '@mui/joy';
import { green } from '@mui/material/colors';
import { AppContext } from 'providers';
import { useState, useRef, useContext, useEffect, useCallback } from 'react';

const LegendeZone = () => {
    const { legendeSection } = useContext(AppContext);
    const dragHandleRef = useRef<HTMLDivElement>(null);

    // Use refs for drag state to avoid re-renders during drag
    const isDraggingRef = useRef(false);
    const startPosRef = useRef({ x: 0, y: 0 });
    const initialCardPosRef = useRef({ x: 340, y: 210 });

    // State for position
    const [position, setPosition] = useState({ x: 340, y: 210 });

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
        initialCardPosRef.current = { ...position };
    }, [position]);

    // Handle pointer move - update position
    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        if (!isDraggingRef.current) return;

        event.preventDefault();
        event.stopPropagation();

        const deltaX = event.clientX - startPosRef.current.x;
        const deltaY = event.clientY - startPosRef.current.y;

        const newX = initialCardPosRef.current.x + deltaX;
        const newY = initialCardPosRef.current.y + deltaY;

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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Ensure pointer capture is released on unmount
            const dragHandle = dragHandleRef.current;
            if (dragHandle && isDraggingRef.current) {
                // Can't release capture here as we don't have the pointerId
            }
        };
    }, []);

    return (
        <Card
            sx={{
                zIndex: 400,
                position: "fixed",
                left: 0,
                top: 0,
                maxWidth: 500,
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDraggingRef.current ? 'grabbing' : 'pointer',
                userSelect: 'none',
                touchAction: 'none',
            }}
            size='sm'
        >
            <Stack
                ref={dragHandleRef}
                component={'div'}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
                sx={{
                    width: 100,
                    height: 20,
                    bgcolor: green[700],
                    borderRadius: 30,
                    alignSelf: "center",
                    cursor: 'grab',
                    justifySelf: "flex-start",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'none',
                }}
            >
                <Tooltip title='Deplacer la légende' >
                    <Typography
                        textColor={'white'}
                        fontWeight={700}
                        fontSize={12}
                        sx={{
                            cursor: 'grab',
                            userSelect: 'none',
                        }}
                    >Legende</Typography>
                </Tooltip>
            </Stack>

            {legendeSection?.coucheDeDonnee && (
                <AccordionGroup sx={{ gap: 1 }} >
                    <Accordion>
                        <AccordionSummary>Couches de donnéés</AccordionSummary>
                        <AccordionDetails>{legendeSection.coucheDeDonnee}</AccordionDetails>
                    </Accordion>
                </AccordionGroup>
            )}

            {legendeSection?.ficheDeDonnee && (
                <AccordionGroup sx={{ gap: 1 }} >
                    <Accordion>
                        <AccordionSummary>Fiches de données</AccordionSummary>
                        <AccordionDetails>{legendeSection.ficheDeDonnee}</AccordionDetails>
                    </Accordion>
                </AccordionGroup>
            )}

            {legendeSection?.ficheDynamique && (
                <AccordionGroup sx={{ gap: 1 }} >
                    <Accordion>
                        <AccordionSummary>Fiches dynamiques</AccordionSummary>
                        <AccordionDetails>{legendeSection.ficheDynamique}</AccordionDetails>
                    </Accordion>
                </AccordionGroup>
            )}
            
            {legendeSection?.rapportCarto && (
                <AccordionGroup sx={{ gap: 1 }} >
                    <Accordion>
                        <AccordionSummary>Rapport cartographique</AccordionSummary>
                        <AccordionDetails>{legendeSection.rapportCarto}</AccordionDetails>
                    </Accordion>
                </AccordionGroup>
            )}
        </Card>
    );
}

export default LegendeZone;