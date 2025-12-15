import { faPen, faEraser, faFont, faDownload, faTimes, faTrash, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, Box, IconButton, Slider, TextField, Button, Stack, Typography, Textarea } from '@mui/joy';
import { blue, red, orange, green } from '@mui/material/colors';
import { useRef, useEffect, useState, useCallback } from 'react';

interface ImageEditorProps {
    imageSrc: string;
    onSave: (blob: Blob) => void;
    onCancel: () => void;
}

interface Point {
    x: number;
    y: number;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onSave, onCancel }) => {
    const [drawingMode, setDrawingMode] = useState<'pen' | 'text' | 'eraser'>('pen');
    const [brushColor, setBrushColor] = useState<string>('#000000');
    const [brushSize, setBrushSize] = useState<number>(5);
    const [textInput, setTextInput] = useState<string>('');
    const [isAddingText, setIsAddingText] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDrawing = useRef<boolean>(false);
    const lastPosition = useRef<Point>({ x: 0, y: 0 });

    const initCanvas = useCallback(() => {
        if (!canvasRef.current || !containerRef.current || !imageSrc) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            // Taille du container
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // Device pixel ratio
            const ratio = window.devicePixelRatio || 1;

            // Résolution réelle du canvas
            canvas.width = containerWidth * ratio;
            canvas.height = containerHeight * ratio;

            // Affichage CSS
            canvas.style.width = `${containerWidth}px`;
            canvas.style.height = `${containerHeight}px`;

            // Scale pour avoir un rendu net
            ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
            ctx.scale(ratio, ratio);

            // Calculer la taille de l'image en gardant le ratio
            let imgWidth = containerWidth;
            let imgHeight = (img.height / img.width) * imgWidth;
            if (imgHeight > containerHeight) {
                imgHeight = containerHeight;
                imgWidth = (img.width / img.height) * imgHeight;
            }

            // Centrer l'image
            const offsetX = (containerWidth - imgWidth) / 2;
            const offsetY = (containerHeight - imgHeight) / 2;

            ctx.clearRect(0, 0, containerWidth, containerHeight);
            ctx.drawImage(img, offsetX, offsetY, imgWidth, imgHeight);

            setImageLoaded(true);
        };
        img.src = imageSrc;
    }, [imageSrc]);


    // Initialiser le canvas quand l'image est chargée
    useEffect(() => {
        initCanvas();
    }, [imageSrc, initCanvas]);

    const getCanvasMousePosition = (e: React.MouseEvent): Point => {
        if (!canvasRef.current) return { x: 0, y: 0 };

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        // Calculer la position relative au canvas
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        return { x, y };
    };

    const startDrawing = (e: React.MouseEvent) => {
        if (isAddingText) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const position = getCanvasMousePosition(e);
        isDrawing.current = true;
        lastPosition.current = position;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(position.x, position.y);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing.current || isAddingText || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const position = getCanvasMousePosition(e);

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = brushSize;

        if (drawingMode === 'pen') {
            ctx.strokeStyle = brushColor;
            ctx.lineTo(position.x, position.y);
            ctx.stroke();
        } else if (drawingMode === 'eraser') {
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.lineTo(position.x, position.y);
            ctx.stroke();
            ctx.restore();
        }

        lastPosition.current = position;
    };

    const stopDrawing = () => {
        isDrawing.current = false;
    };

    const addText = (e: React.MouseEvent) => {
        if (!textInput.trim() || !isAddingText || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const position = getCanvasMousePosition(e);

        ctx.font = `bold ${brushSize * 6}px Arial`; // Texte plus grand
        ctx.fillStyle = brushColor;
        ctx.fillText(textInput, position.x, position.y);

        setTextInput('');
        setIsAddingText(false);
        setDrawingMode('pen');
    };

    const startTextMode = () => {
        setDrawingMode('text');
        setIsAddingText(true);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Recréer l'image de fond
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.onerror = () => {
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        img.src = imageSrc;
    };

    const saveImage = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.toBlob((blob) => {
                if (blob) {
                    onSave(blob);
                }
            }, 'image/png', 1.0);
        }
    };

    const forceRerender = () => {
        setImageLoaded(false);

        initCanvas();

        setTimeout(() => {
            if (canvasRef.current && imageSrc) {
                const img = new Image();
                img.onload = () => {
                    const ctx = canvasRef.current?.getContext('2d');
                    if (!ctx) return;

                    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
                    ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
                    setImageLoaded(true);
                };
                img.src = imageSrc;
            }
        }, 3000);
    };

    return (
        <Modal open={true} onClose={onCancel}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'white',
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 24,
                    width: '90vw',
                    height: '90vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Stack gap={2} sx={{ height: '100%' }}>
                    <Typography level="h4">Éditeur d'image</Typography>

                    {/* Barre d'outils */}
                    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                        <IconButton
                            variant={drawingMode === 'pen' ? 'solid' : 'outlined'}
                            onClick={() => setDrawingMode('pen')}
                            sx={{ color: blue[700] }}
                        >
                            <FontAwesomeIcon icon={faPen} />
                        </IconButton>

                        <IconButton
                            variant={drawingMode === 'text' ? 'solid' : 'outlined'}
                            onClick={startTextMode}
                            sx={{ color: orange[700] }}
                        >
                            <FontAwesomeIcon icon={faFont} />
                        </IconButton>

                        <IconButton
                            variant={drawingMode === 'eraser' ? 'solid' : 'outlined'}
                            onClick={() => setDrawingMode('eraser')}
                            sx={{ color: red[700] }}
                        >
                            <FontAwesomeIcon icon={faEraser} />
                        </IconButton>

                        <Typography level="body-sm">Taille:</Typography>
                        <Slider
                            value={brushSize}
                            onChange={(event: Event, value: number | number[]) => setBrushSize(value as number)}
                            min={1}
                            max={30} // Taille de pinceau plus grande
                            sx={{ width: 100 }}
                        />

                        <input
                            type="color"
                            value={brushColor}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBrushColor(e.target.value)}
                            style={{ width: 40, height: 40, border: '1px solid #ccc' }}
                        />

                        <Button
                            variant="outlined"
                            onClick={clearCanvas}
                            startDecorator={<FontAwesomeIcon icon={faTrash} />}
                        >
                            Effacer
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={forceRerender}
                            color="neutral"
                            startDecorator={<FontAwesomeIcon icon={faSync} />}
                        >
                            Actualiser
                        </Button>
                    </Stack>

                    {isAddingText && (
                        <Stack direction="row" gap={1} alignItems="center">
                            <Textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Entrez votre texte"
                                sx={{ flex: 1 }}
                            />
                            <Typography level="body-sm">
                                Cliquez sur l'image pour placer le texte
                            </Typography>
                        </Stack>
                    )}

                    {/* Canvas container - Beaucoup plus grand */}
                    <Box
                        ref={containerRef}
                        sx={{
                            flex: 1,                 // prend tout l'espace restant
                            border: '2px solid #ccc',
                            borderRadius: 1,
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f8f9fa',
                            cursor: isAddingText ? 'text' : drawingMode !== 'pen' ? 'default' : 'crosshair'
                        }}
                        onClick={isAddingText ? addText : undefined}
                    >
                        {!imageLoaded && (
                            <Stack alignItems="center" gap={1}>
                                <Typography>Chargement de l'image...</Typography>
                                <Button onClick={forceRerender} size="sm">
                                    Réessayer
                                </Button>
                            </Stack>
                        )}
                        <canvas
                            ref={canvasRef}
                            onMouseDown={!isAddingText ? startDrawing : undefined}
                            onMouseMove={!isAddingText ? draw : undefined}
                            onMouseUp={!isAddingText ? stopDrawing : undefined}
                            onMouseLeave={!isAddingText ? stopDrawing : undefined}
                            style={{
                                display: imageLoaded ? 'block' : 'none',
                                width: '100%',
                                height: '100%',   // ici height = container, pas tout le modal
                                maxWidth: '100%',
                                maxHeight: '100%',
                                backgroundColor: 'white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }}
                        />
                    </Box>

                    {/* Boutons d'action */}
                    <Stack direction="row" gap={1} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            startDecorator={<FontAwesomeIcon icon={faTimes} />}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={saveImage}
                            disabled={!imageLoaded}
                            sx={{ bgcolor: green[700], color: 'white' }}
                            startDecorator={<FontAwesomeIcon icon={faDownload} />}
                        >
                            Sauvegarder
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ImageEditor;