import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Stack, Typography } from '@mui/joy';
import { green } from '@mui/material/colors';
import { MutableRefObject, useState } from 'react';
import download from 'downloadjs';
import * as htmlToImage from 'html-to-image';

export default ({ mapRef }: { mapRef: MutableRefObject<HTMLDivElement | null> }) => {
    const [printLoadingState, setprintLoadingState] = useState(false);

    const handlePrint = async () => {
        if (mapRef.current) {
            setprintLoadingState(true);

            try {
                const dataUrl = await htmlToImage.toPng(mapRef.current);
                download(dataUrl, 'map.png');
                setprintLoadingState(false);
            } catch (error) {
                console.error('Error capturing screenshot:', error);
                setprintLoadingState(false);
            }
        }
    };

    return (
        <Stack
            bgcolor={'whitesmoke'}
            p={1}
            borderRadius={8}
            gap={1}
        >
            <Typography>
                Ceci procédera à une exportation de la carte présente dans l'interface ainsi que tous ses éléments affichés.
            </Typography>

            <Button
                onClick={() => handlePrint()}
                sx={{
                    bgcolor: green[700],
                    color: 'white',
                    ':hover': {
                        bgcolor: green[900],
                    },
                }}
                endDecorator={
                    <FontAwesomeIcon icon={faImage} />
                }
                loading={printLoadingState}
            >
                Exporter la carte
            </Button>
        </Stack>
    );
};