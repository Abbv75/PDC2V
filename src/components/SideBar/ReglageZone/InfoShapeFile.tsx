import { Button, Stack, Typography } from '@mui/joy';
import { memo, useState } from 'react';
import { Sheet, Switch } from "@mui/joy";
import useCoucheDeDonneeStore from 'stores/coucheDeDonnee/useCoucheDeDonneeStore';
import { Collapse } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import useReglageStore from 'stores/reglage/useReglageStore';

export default memo(() => {
    const { showShapefilePopup } = useReglageStore();
    const setReglageData = useReglageStore((state) => state.set);

    const [isOpen, setisOpen] = useState(true);

    const handleChange = () => {
        setReglageData({
            showShapefilePopup: showShapefilePopup
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
                PopUp Shapefile
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
                    <Typography>Afficher les informations des shapefiles</Typography>

                    <Switch
                        checked={showShapefilePopup}
                        onChange={handleChange}
                    />
                </Sheet>
            </Collapse>
        </Stack>
    );
})