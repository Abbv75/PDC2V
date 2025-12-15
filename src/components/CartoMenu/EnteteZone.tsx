import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Stack } from '@mui/joy'
import { CARTO_MENU_EN_TETE_ZONE } from 'constant'
import { useContext } from 'react'
import { CartoMenuContext } from '../../providers'
import { grey } from '@mui/material/colors'
import { Collapse } from '@mui/material'

const EnteteZone = () => {
    const {
        setcurrentMenu,
        currentMenu,
        setcartoMenuIsOpen,
        cartoMenuIsOpen
    } = useContext(CartoMenuContext);

    return (
        <Stack
            direction={"row"}
        >
            {
                CARTO_MENU_EN_TETE_ZONE.map(value => (
                    <Button
                        sx={{
                            borderRadius: `13px 13px 0 0`,
                            bgcolor: currentMenu === value ? value.color[700] : grey[700],
                            fontSize: 11,
                        }}
                        startDecorator={
                            value.icon && <FontAwesomeIcon icon={value.icon} />
                        }
                        onClick={() => {
                            setcurrentMenu(value);
                            setcartoMenuIsOpen(currentMenu === value ? !cartoMenuIsOpen : true);
                        }}
                        title={currentMenu !== value ? value.nom : undefined}
                    >
                        <Collapse
                            in={currentMenu === value}
                            orientation='horizontal'
                            unmountOnExit
                            sx={{
                                textWrap:"nowrap"
                            }}
                        >
                            {value.nom}
                        </Collapse>
                    </Button>
                ))
            }
        </Stack>
    )
}

export default EnteteZone