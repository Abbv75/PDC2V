import { Stack } from '@mui/joy'
import EnteteZone from './EnteteZone'
import { Collapse } from '@mui/material'
import { useEffect, useState } from 'react'
import { CartoMenuContext } from '../../providers'
import { CARTO_MENU_EN_TETE_ZONE } from 'constant'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons'
import CoucheDeDonnee from './CoucheDeDonnee'
import FicheDeDonnee from './FicheDeDonnee'
import FichesDynamiques from './FichesDynamiques'
import RapportCartographique from './RapportCartographique'

const CartoMenu = () => {
    const [currentMenu, setcurrentMenu] = useState(CARTO_MENU_EN_TETE_ZONE[0]);
    const [cartoMenuIsOpen, setcartoMenuIsOpen] = useState(false);
    const [pane, setpane] = useState(<>Le composant par defaut</>);

    useEffect(
        () => {
            setcartoMenuIsOpen(true);

            switch (currentMenu) {
                case CARTO_MENU_EN_TETE_ZONE[0]:
                    setpane(<CoucheDeDonnee />); break;

                case CARTO_MENU_EN_TETE_ZONE[1]:
                    setpane(<FicheDeDonnee />); break;

                case CARTO_MENU_EN_TETE_ZONE[2]:
                    setpane(<FichesDynamiques />); break;

                case CARTO_MENU_EN_TETE_ZONE[3]:
                    setpane(<RapportCartographique />); break;
            }
        },
        [currentMenu]
    )

    return (
        <CartoMenuContext.Provider
            value={{
                currentMenu: currentMenu,
                setcurrentMenu: setcurrentMenu,
                setcartoMenuIsOpen: setcartoMenuIsOpen,
                cartoMenuIsOpen: cartoMenuIsOpen
            }}
        >
            <Stack
                position={"fixed"}
                bottom={10}
                left={10}
                zIndex={1000}
            >
                <EnteteZone />

                <Collapse
                    in={cartoMenuIsOpen}
                    sx={{
                        bgcolor: currentMenu.color[200],
                        p: 1,
                        borderRadius: '13px',
                        borderTopLeftRadius: 0,
                        border: `2px solid ${currentMenu.color[900]}`,
                        width: 330
                    }}
                    // unmountOnExit
                >
                    <Stack
                        gap={1}
                        // maxHeight={350}
                        sx={{
                            // overflowY: "scroll",
                            // pr: 1,
                            // "&::-webkit-scrollbar": {
                            //     display: "none"
                            // }
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faArrowAltCircleDown}
                            style={{
                                alignSelf: "flex-end",
                                color: "white",
                                cursor: "pointer"
                            }}
                            onClick={() => { setcartoMenuIsOpen(!cartoMenuIsOpen) }}
                        />
                        {pane}
                    </Stack>
                </Collapse>
            </Stack>
        </CartoMenuContext.Provider>
    )
}

export default CartoMenu