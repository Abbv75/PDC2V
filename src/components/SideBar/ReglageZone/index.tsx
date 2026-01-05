import { Stack, Typography } from '@mui/joy';
import { memo } from 'react';
import { Sheet, Switch } from "@mui/joy";
import useCoucheDeDonneeStore from 'stores/coucheDeDonnee/useCoucheDeDonneeStore';

export default memo(() => {
    const {coucheDeDonneesElementConfig,} = useCoucheDeDonneeStore();
    const setcoucheDeDonneesData = useCoucheDeDonneeStore((state) => state.set);

    return (
        <Stack
            bgcolor={'whitesmoke'}
            p={1}
            borderRadius={8}
            gap={1}
        >
            <Typography>
                Accedez à different niveau de configuration de la carte.
            </Typography>

            <Sheet
                variant="outlined"
                sx={{ p: 1, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Typography>Afficher les noms de couches</Typography>
                <Switch
                    checked={coucheDeDonneesElementConfig.showShapefileName}
                    onChange={() => setcoucheDeDonneesData({
                        coucheDeDonneesElementConfig: {
                            ...coucheDeDonneesElementConfig,
                            showShapefileName: !coucheDeDonneesElementConfig.showShapefileName
                        }
                    })}
                />
            </Sheet>

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