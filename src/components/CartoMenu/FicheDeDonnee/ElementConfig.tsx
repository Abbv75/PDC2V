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
    FormGroup
} from "@mui/material";
import { CardMedia } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
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
    data: { [key: string]: any }[];
    fieldKeyListe: { originaleName: string, renamed?: string }[] | '*';
}

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
    data,
    fieldKeyListe
}: ElementConfigProps) => {
    const { set: setIconMapData } = useIconMapStore();
    const [size, setSize] = useState(iconSize);
    const [localSelectedFields, setLocalSelectedFields] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState(true);

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

