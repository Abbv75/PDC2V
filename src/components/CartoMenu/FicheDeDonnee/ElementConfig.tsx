import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Slider,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField
} from "@mui/material";
import { CardMedia } from "@mui/material";
import { useState, useEffect, useMemo, useRef } from "react";
import useIconMapStore from "stores/iconMap/useIconMapStore";

interface ElementConfigProps {
    open: boolean;
    onClose: () => void;
    title: string;
    icon: string;
    iconSize: number;
    selectedFields?: string[];
    onIconChange: (icon: string) => void;
    onIconSizeChange: (size: number) => void;
    onSelectedFieldsChange: (fields: string[]) => void;
    onMarkerTextFontChange?: (fontConfig: {
        fontSize: number | 'normal';
        fontWeight: 'normal' | 700;
        fontFamily: string;
        fontColor?: string;
        bgColor?: string;
    }) => void;
    data: { [key: string]: any }[];
    fieldKeyListe: { originaleName: string, renamed?: string }[] | '*';
    markerTextFont?: {
        fontSize: number | 'normal';
        fontWeight: 'normal' | 700;
        fontFamily: string;
        fontColor?: string;
        bgColor?: string;
    };
}

const FONT_FAMILIES = [
    'Arial',
    'Roboto',
    'Helvetica',
    'Georgia',
    'Times New Roman',
    'Verdana',
    'Courier New',
    'Comic Sans MS',
    'Impact',
    'Tahoma'
];

export default ({
    open,
    onClose,
    title,
    icon,
    iconSize,
    selectedFields = [],
    onIconChange,
    onIconSizeChange,
    onSelectedFieldsChange,
    onMarkerTextFontChange,
    data,
    fieldKeyListe,
    markerTextFont
}: ElementConfigProps) => {
    const { set: setIconMapData } = useIconMapStore();
    const [size, setSize] = useState(iconSize);
    const [localSelectedFields, setLocalSelectedFields] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState(true);
    
    // Font configuration state
    const [fontSize, setFontSize] = useState<number | 'normal'>((markerTextFont?.fontSize as number) || 'normal');
    const [fontWeight, setFontWeight] = useState<'normal' | 700>(markerTextFont?.fontWeight || 'normal');
    const [fontFamily, setFontFamily] = useState(markerTextFont?.fontFamily || 'Arial');
    const [fontColor, setFontColor] = useState(markerTextFont?.fontColor || '#000000');
    const [bgColor, setBgColor] = useState(markerTextFont?.bgColor || 'green');
    
    // Track if font settings have been initialized from props
    const fontInitializedRef = useRef(false);

    // Initialize selected fields from props
    useEffect(() => {
        if (selectedFields.length > 0) {
            setLocalSelectedFields(new Set(selectedFields));
        } else if (data.length > 0) {
            // Default: select all fields except excluded ones
            const firstItem = data[0];
            const allKeys = Object.keys(firstItem).filter(
                k => !['latitude', 'longitude', 'LT', 'LG', 'textIcon'].includes(k)
            );
            setLocalSelectedFields(new Set(allKeys));
        }
    }, [data, selectedFields]);

    // Initialize font settings from props only once when dialog opens
    useEffect(() => {
        if (open && !fontInitializedRef.current && markerTextFont) {
            setFontSize(markerTextFont.fontSize);
            setFontWeight(markerTextFont.fontWeight);
            setFontFamily(markerTextFont.fontFamily);
            setFontColor(markerTextFont.fontColor || '#000000');
            setBgColor(markerTextFont.bgColor || 'green');
            fontInitializedRef.current = true;
        }
        
        // Reset initialization flag when dialog closes
        if (!open) {
            fontInitializedRef.current = false;
        }
    }, [open, markerTextFont]);

    const handleSizeChange = (e: Event, newValue: number | number[]) => {
        setSize(newValue as number);
    };

    const handleSizeChangeCommitted = (e: Event, newValue: number | number[]) => {
        onIconSizeChange(newValue as number);
    };

    const handleFieldToggle = (fieldName: string) => {
        const newSelected = new Set(localSelectedFields);
        if (newSelected.has(fieldName)) {
            newSelected.delete(fieldName);
        } else {
            newSelected.add(fieldName);
        }
        setLocalSelectedFields(newSelected);
        setSelectAll(newSelected.size === getDisplayableFields().length);
        onSelectedFieldsChange(Array.from(newSelected));
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        if (checked) {
            const allFields = getDisplayableFields();
            setLocalSelectedFields(new Set(allFields));
            onSelectedFieldsChange(allFields);
        } else {
            setLocalSelectedFields(new Set());
            onSelectedFieldsChange([]);
        }
    };

    const handleFontSizeChange = (e: Event, newValue: number | number[]) => {
        setFontSize(newValue as number);
    };

    const handleFontSizeChangeCommitted = (e: Event, newValue: number | number[]) => {
        if (onMarkerTextFontChange) {
            onMarkerTextFontChange({
                fontSize: newValue as number,
                fontWeight,
                fontFamily,
                fontColor,
                bgColor
            });
        }
    };

    const handleFontWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newWeight = (event.target.checked ? 700 : 'normal') as 'normal' | 700;
        setFontWeight(newWeight);
        if (onMarkerTextFontChange) {
            onMarkerTextFontChange({
                fontSize,
                fontWeight: newWeight,
                fontFamily,
                fontColor,
                bgColor
            });
        }
    };

    const handleFontFamilyChange = (event: any) => {
        const newFamily = event.target.value as string;
        setFontFamily(newFamily);
        if (onMarkerTextFontChange) {
            onMarkerTextFontChange({
                fontSize,
                fontWeight,
                fontFamily: newFamily,
                fontColor,
                bgColor
            });
        }
    };

    const handleFontColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = event.target.value;
        setFontColor(newColor);
        if (onMarkerTextFontChange) {
            onMarkerTextFontChange({
                fontSize,
                fontWeight,
                fontFamily,
                fontColor: newColor,
                bgColor
            });
        }
    };

    const handleBgColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = event.target.value;
        setBgColor(newColor);
        if (onMarkerTextFontChange) {
            onMarkerTextFontChange({
                fontSize,
                fontWeight,
                fontFamily,
                fontColor,
                bgColor: newColor
            });
        }
    };

    const getDisplayableFields = () => {
        if (!data.length) return [];
        const firstItem = data[0];
        return Object.keys(firstItem).filter(
            k => !['latitude', 'longitude', 'LT', 'LG', 'textIcon'].includes(k)
        );
    };

    const getFieldLabel = (fieldName: string) => {
        if (fieldKeyListe === '*') return fieldName;
        const field = fieldKeyListe.find(f => f.originaleName === fieldName);
        return field?.renamed || field?.originaleName || fieldName;
    };

    const displayableFields = useMemo(() => getDisplayableFields(), [data]);

    const openIconPicker = () => {
        setIconMapData({
            showImagePicker: true,
            onChange: onIconChange
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Stack direction="row" alignItems="center" gap={1}>
                    <Typography variant="h6">{title}</Typography>
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3}>
                    {/* Icon Selection */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Icône
                        </Typography>
                        <Avatar
                            variant="circular"
                            sx={{
                                p: 0.5,
                                width: 60,
                                height: 60,
                                border: `1px solid #ccc`,
                                cursor: 'pointer'
                            }}
                            onClick={openIconPicker}
                        >
                            <CardMedia
                                component='img'
                                src={icon}
                                sx={{ width: 50, height: 50 }}
                            />
                        </Avatar>
                        <Typography variant="caption" color="text.secondary">
                            Cliquez sur l'icône pour la changer
                        </Typography>
                    </Box>

                    {/* Icon Size Slider */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Taille de l'icône: {size}px
                        </Typography>
                        <Slider
                            value={size}
                            min={10}
                            max={100}
                            step={5}
                            onChange={handleSizeChange}
                            onChangeCommitted={(e, newValue) => handleSizeChangeCommitted(e as any, newValue)}
                            valueLabelDisplay="auto"
                        />
                    </Box>

                    {/* Size Preview */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Aperçu
                        </Typography>
                        <Box
                            sx={{
                                width: 120,
                                height: 120,
                                border: '1px dashed #ccc',
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#f5f5f5'
                            }}
                        >
                            <img
                                src={icon}
                                alt="Preview"
                                style={{
                                    width: size,
                                    height: size
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Font Configuration for Numbers */}
                    {onMarkerTextFontChange && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Police des nombres affichés
                            </Typography>
                            
                            <Stack spacing={2}>
                                {/* Font Family */}
                                <FormControl size="small">
                                    <InputLabel>Police</InputLabel>
                                    <Select
                                        value={fontFamily}
                                        label="Police"
                                        onChange={handleFontFamilyChange}
                                    >
                                        {FONT_FAMILIES.map((font) => (
                                            <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                                                {font}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Font Size */}
                                <Box>
                                    <Typography variant="caption" gutterBottom>
                                        Taille de la police: {fontSize === 'normal' ? 'Normal' : fontSize + 'px'}
                                    </Typography>
                                    <Slider
                                        value={fontSize === 'normal' ? 14 : fontSize as number}
                                        min={8}
                                        max={32}
                                        step={1}
                                        onChange={handleFontSizeChange}
                                        onChangeCommitted={(e, newValue) => handleFontSizeChangeCommitted(e as any, newValue)}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => value === 14 ? 'Normal' : value + 'px'}
                                    />
                                </Box>

                                {/* Font Weight */}
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={fontWeight === 700}
                                                onChange={handleFontWeightChange}
                                            />
                                        }
                                        label="Gras"
                                    />
                                </FormGroup>

                                {/* Font Color */}
                                <Box>
                                    <Typography variant="caption" gutterBottom>
                                        Couleur de la police: {fontColor}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <input
                                            type="color"
                                            value={fontColor}
                                            onChange={handleFontColorChange}
                                            title="Couleur de la police"
                                            style={{
                                                width: 40,
                                                height: 40,
                                                cursor: 'pointer',
                                                border: '1px solid #ccc',
                                                borderRadius: 4
                                            }}
                                        />
                                        <TextField
                                            size="small"
                                            value={fontColor}
                                            onChange={handleFontColorChange}
                                            sx={{ width: 100 }}
                                            placeholder="#000000"
                                        />
                                    </Box>
                                </Box>

                                {/* Background Color */}
                                <Box>
                                    <Typography variant="caption" gutterBottom>
                                        Couleur de fond: {bgColor}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <input
                                            type="color"
                                            value={bgColor}
                                            onChange={handleBgColorChange}
                                            title="Couleur de fond"
                                            style={{
                                                width: 40,
                                                height: 40,
                                                cursor: 'pointer',
                                                border: '1px solid #ccc',
                                                borderRadius: 4
                                            }}
                                        />
                                        <TextField
                                            size="small"
                                            value={bgColor}
                                            onChange={handleBgColorChange}
                                            sx={{ width: 100 }}
                                            placeholder="green"
                                        />
                                    </Box>
                                </Box>

                                {/* Font Preview */}
                                <Box
                                    sx={{
                                        p: 2,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 1,
                                        bgcolor: '#f9f9f9'
                                    }}
                                >
                                    <Typography variant="caption" color="text.secondary">
                                        Aperçu:
                                    </Typography>
                                    <Box
                                        sx={{
                                            fontFamily: fontFamily,
                                            fontSize: fontSize === 'normal' ? 14 : fontSize + 'px',
                                            fontWeight: fontWeight,
                                            color: fontColor,
                                            backgroundColor: bgColor,
                                            padding: '5px 10px',
                                            borderRadius: '50px',
                                            mt: 1,
                                            display: 'inline-block'
                                        }}
                                    >
                                        123 - Exemple
                                    </Box>
                                </Box>
                            </Stack>
                        </Box>
                    )}

                    {/* Field Selection */}
                    <Box>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectAll}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                }
                                label="Tout cocher"
                            />
                        </FormGroup>

                        <TableContainer sx={{ maxHeight: 300, mt: 1 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={50}>Afficher</TableCell>
                                        <TableCell>Champ</TableCell>
                                        <TableCell>Exemple (1ère ligne)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {displayableFields.map((field) => (
                                        <TableRow key={field}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={localSelectedFields.has(field)}
                                                    onChange={() => handleFieldToggle(field)}
                                                />
                                            </TableCell>
                                            <TableCell>{getFieldLabel(field)}</TableCell>
                                            <TableCell>
                                                {String(data[0]?.[field] ?? '-').substring(0, 30)}
                                                {(String(data[0]?.[field] ?? '').length > 30 ? '...' : '')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
            </DialogActions>
        </Dialog>
    );
};

