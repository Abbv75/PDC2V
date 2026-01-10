import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Select, Option, Stack, Typography } from '@mui/joy';
import { green } from '@mui/material/colors';
import { MutableRefObject, useState } from 'react';
import download from 'downloadjs';
import * as htmlToImage from 'html-to-image';

export default ({ mapRef }: { mapRef: MutableRefObject<HTMLDivElement | null> }) => {
    const [printLoadingState, setprintLoadingState] = useState(false);
    const [format, setFormat] = useState('png');

    const handlePrint = async () => {
        if (mapRef.current) {
            setprintLoadingState(true);

            try {
                let dataUrl: string;
                let filename: string;
                switch (format) {
                    case 'jpg':
                        dataUrl = await htmlToImage.toJpeg(mapRef.current);
                        filename = 'map.jpg';
                        break;
                    case 'svg':
                        dataUrl = await htmlToImage.toSvg(mapRef.current);
                        filename = 'map.svg';
                        break;
                    default:
                        dataUrl = await htmlToImage.toPng(mapRef.current);
                        filename = 'map.png';
                }
                download(dataUrl, filename);
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

            <Select
                value={format}
                onChange={(event, newValue) => setFormat(newValue || 'png')}
                sx={{ mb: 1 }}
            >
                <Option value="png">PNG</Option>
                <Option value="jpg">JPG</Option>
                <Option value="svg">SVG</Option>
            </Select>

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