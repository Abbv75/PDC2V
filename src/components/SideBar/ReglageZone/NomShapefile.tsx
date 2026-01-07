import { Button, Stack, Typography } from '@mui/joy';
import { memo, useState } from 'react';
import { Sheet, Switch } from "@mui/joy";
import { Collapse } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import useReglageStore from 'stores/reglage/useReglageStore';

export default memo(() => {
    const { showShapefileName } = useReglageStore();
    const setReglageData = useReglageStore((state) => state.set);

    const [isOpen, setisOpen] = useState(true);

    const handleChange = () => {
        setReglageData({
            showShapefileName: !showShapefileName
        })
    }

    return (
        <Stack
            gap={1}
        >
            <Button
                sx={{
                    gap: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
                variant='plain'
                onClick={() => {
                    setisOpen(!isOpen);
                }}
            >
                Nom de couche
                <FontAwesomeIcon
                    icon={isOpen ? faAngleUp : faAngleDown}
                    style={{
                        marginLeft: 'auto'
                    }}
                />
            </Button>

            <Collapse in={isOpen} >
                <Sheet
                    variant="outlined"
                    sx={{ p: 1, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Typography>Afficher les noms de couches</Typography>
                    <Switch
                        checked={showShapefileName}
                        onChange={handleChange}
                    />
                </Sheet>
            </Collapse>


            {/* <Sheet
                variant="outlined"
                sx={{ p: 1, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Typography>Afficher les informations des shapefiles</Typography>
                <Switch
                    checked={coucheDeDonneesElementConfig.showShapefilePopup}
                    onChange={() => setcoucheDeDonneesElementConfig((prev) => ({
                        ...prev,
                        showShapefilePopup: !prev.showShapefilePopup
                    }))}
                />
            </Sheet> */}

        </Stack>
    );
})