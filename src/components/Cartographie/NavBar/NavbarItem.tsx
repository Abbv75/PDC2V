import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Stack } from "@mui/joy"
import { Collapse } from "@mui/material"
import { CARTO_MENU_EN_TETE_ZONE } from "constant"
import { useState } from "react"
import { USE_STATE_T } from "types"

export default ({
    item,
    isNavbarOpen,
    setisNavbarOpen
}: {
    item: typeof CARTO_MENU_EN_TETE_ZONE[0],
    isNavbarOpen: boolean,
    setisNavbarOpen: USE_STATE_T<boolean>
}) => {
    const [isOpen, setisOpen] = useState(false);

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
                variant='soft'
                onClick={() => {
                    setisOpen(!isOpen);
                    !isNavbarOpen && setisNavbarOpen(true);
                }}
            >
                <FontAwesomeIcon icon={item.icon} />

                {isNavbarOpen && item.nom}

                {isNavbarOpen && (
                    <FontAwesomeIcon
                        icon={isOpen ? faAngleUp : faAngleDown}
                        style={{
                            marginLeft: 'auto'
                        }}
                    />
                )}
            </Button>

            <Collapse in={isOpen && isNavbarOpen} >
                {<item.children />}
            </Collapse>

        </Stack>
    )
}
