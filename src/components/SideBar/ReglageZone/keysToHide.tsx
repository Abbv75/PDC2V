import { Button, Input, Stack, Typography, Sheet } from '@mui/joy';
import { memo, useState } from 'react';
import { Collapse } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import useReglageStore from 'stores/reglage/useReglageStore';

export default memo(() => {
    const { keyToHides, addKeyToHide, removeKeyToHide } = useReglageStore();
    const [isOpen, setIsOpen] = useState(true);
    const [value, setValue] = useState('');

    const handleAdd = () => {
        const v = value.trim();
        if (!v) return;
        addKeyToHide(v);
        setValue('');
    };

    return (
        <Stack gap={1}>
            <Button
                variant="plain"
                sx={{ gap: 1, justifyContent: 'flex-start' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                Champ à bannir
                <FontAwesomeIcon
                    icon={isOpen ? faAngleUp : faAngleDown}
                    style={{ marginLeft: 'auto' }}
                />
            </Button>

            <Collapse in={isOpen}>
                <Sheet
                    variant="outlined"
                    sx={{
                        p: 1,
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Typography>
                        Ces champs seront masqués dans les shapefiles
                    </Typography>

                    {/* Input ajout */}
                    <Input
                        placeholder="Ex: population, code_region..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        endDecorator={
                            <Button size="sm" onClick={handleAdd}>
                                Ajouter
                            </Button>
                        }
                    />

                    {/* Liste des clés */}
                    <Stack direction="row" gap={1} flexWrap="wrap">
                        {keyToHides.map((key) => (
                            <Button
                                key={key}
                                size="sm"
                                variant="soft"
                                sx={{
                                    borderRadius: 20,
                                    gap: 0.5,
                                }}
                                endDecorator={
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => removeKeyToHide(key)}
                                    />
                                }
                            >
                                {key}
                            </Button>
                        ))}
                    </Stack>
                </Sheet>
            </Collapse>
        </Stack>
    );
});
