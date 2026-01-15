import { blue } from "@mui/material/colors";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { Popup } from "react-leaflet";
import { useCallback, useRef, useState } from "react";

export interface PopUpDataItem {
    label: string;
    value: any;
}

interface PopUpContentProps {
    popUpData: PopUpDataItem[];
    selectedFields?: string[];
}

// Fields to hide by default
const DEFAULT_HIDDEN_FIELDS = ['LG', 'LT', 'latitude', 'longitude'];

const PopUpContent = ({ popUpData, selectedFields }: PopUpContentProps) => {
    // Filter popUpData based on selectedFields if provided
    // If selectedFields is provided and has items, only show those fields
    // If selectedFields is not provided or empty, show all fields EXCEPT the default hidden ones
    const filteredPopUpData = selectedFields && selectedFields.length > 0
        ? popUpData.filter(item => selectedFields.includes(item.label))
        : popUpData.filter(item => !DEFAULT_HIDDEN_FIELDS.includes(item.label));

    const [dimensions, setDimensions] = useState({ width: 400, height: 250 });
    const containerRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const startDimensions = useRef({ width: 0, height: 0 });

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };
        startDimensions.current = { ...dimensions };
        
        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!isResizing.current) return;
            
            const deltaX = startPos.current.x - moveEvent.clientX;
            const deltaY = startPos.current.y - moveEvent.clientY;
            
            const newWidth = Math.max(200, Math.min(600, startDimensions.current.width + deltaX));
            const newHeight = Math.max(100, Math.min(500, startDimensions.current.height + deltaY));
            
            setDimensions({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            isResizing.current = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [dimensions]);

    return (
        <Popup>
            <Box 
                className="popup-resize-container"
                ref={containerRef}
                style={{ position: 'relative' }}
            >
                <TableContainer
                    sx={{
                        width: dimensions.width,
                        height: dimensions.height,
                        overflow: 'auto'
                    }}
                >
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 700, fontSize: 11 }}>
                                    Champ
                                </TableCell>
                                <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 700, fontSize: 11, textAlign: 'right' }}>
                                    Valeur
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPopUpData.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell
                                        sx={{
                                            fontSize: 11,
                                            color: blue[600],
                                            fontWeight: 700,
                                            maxWidth: '50%',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {item.label}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontSize: 11,
                                            textAlign: 'right',
                                            maxWidth: '50%',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {item.value}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box
                    onMouseDown={handleMouseDown}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '20px',
                        height: '20px',
                        cursor: 'nw-resize',
                        zIndex: 10,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '3px',
                            left: '3px',
                            width: '8px',
                            height: '8px',
                            borderLeft: '2px solid rgba(0, 0, 0, 0.4)',
                            borderTop: '2px solid rgba(0, 0, 0, 0.4)',
                        }
                    }}
                />
            </Box>
        </Popup>
    );
};

export default PopUpContent;

