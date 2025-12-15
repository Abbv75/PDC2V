import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Card, Stack, Tooltip, Typography } from '@mui/joy';
import { green } from '@mui/material/colors';
import { AppContext } from 'providers';
import { useState, useCallback, useRef, useContext } from 'react';

const LegendeZone = () => {
    const { legendeSection } = useContext(AppContext);

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 60, y: 70 });

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
        event.stopPropagation();
        if (!isDragging) return;
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
        <Card
            sx={{
                zIndex: 400,
                position: "fixed",
                left: 0,
                top: 0,
                maxWidth: 500,
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? 'grabbing' : 'pointer',
            }}
            size='sm'
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <Stack
                component={'div'}
                onMouseDown={handleMouseDown}
                sx={{
                    width: 100,
                    height: 20,
                    bgcolor: green[700],
                    borderRadius: 30,
                    alignSelf: "center",
                    cursor: 'grab',
                    justifySelf: "flex-start",
                }}
            >
                <Tooltip title='Deplacer la légende' >
                    <Typography
                        textColor={'white'}
                        fontWeight={700}
                        fontSize={12}
                        textAlign={'center'}
                        sx={{
                            cursor:'pointer'
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