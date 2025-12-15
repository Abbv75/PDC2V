import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card, Stack, Typography } from '@mui/joy'
import { Collapse } from '@mui/material'
import { green } from '@mui/material/colors'
import { SIDE_PANEL_LIST } from 'constant'
import FondDeCarteZone from './FondDeCarteZone'
import { useContext, useEffect, useState } from 'react'
import RapportZone from './RapportZone'
import ReglageZone from './ReglageZone'
import CaptureZone from './CaptureZone'
import { AppContext } from 'providers'

const SideBar = () => {
    const {mapRef} = useContext(AppContext);
    const [currentPanel, setcurrentPanel] = useState(null as null | typeof SIDE_PANEL_LIST[0]);
    const [pannelToShow, setpannelToShow] = useState(undefined as undefined | JSX.Element);

    useEffect(
        () => {
            switch (currentPanel) {
                case SIDE_PANEL_LIST[0]:
                    setpannelToShow(
                        <FondDeCarteZone />
                    ); break;

                case SIDE_PANEL_LIST[1]:
                    setpannelToShow(
                        <CaptureZone mapRef={mapRef} />
                    ); break;

                case SIDE_PANEL_LIST[2]:
                    setpannelToShow(
                        <ReglageZone />
                    ); break;

                // case SIDE_PANEL_LIST[2]:
                //     setpannelToShow(
                //         <RapportZone />
                //     ); break;
            }
        },
        [currentPanel]
    )

    return (
        <Stack
            position={"fixed"}
            top={70}
            right={10}
            zIndex={999}
            direction={'row'}
            gap={1}
            alignItems={'flex-start'}
        >
            <Collapse
                in={!!currentPanel}
                orientation='horizontal'
            >
                <Stack
                    bgcolor={green[200]}
                    p={1}
                    borderRadius={13}
                    border={`2px solid ${green[800]}`}
                    gap={1}
                    width={250}
                    height={!!currentPanel ? 'initial' : 0}
                >
                    <Typography
                        bgcolor={green[700]}
                        textColor={"white"}
                        p={0.7}
                        pl={1}
                        borderRadius={8}
                        fontWeight={700}
                        fontSize={12}
                    >
                        {currentPanel?.nom}
                    </Typography>

                    {pannelToShow}

                </Stack>
            </Collapse>

            <Stack
                bgcolor={green[200]}
                p={0.5}
                borderRadius={13}
                border={`2px solid ${green[800]}`}
                gap={1}
            >
                {
                    SIDE_PANEL_LIST.map(value => (
                        <Card
                            sx={{
                                p: 0.7,
                                aspectRatio: '1/1',
                                cursor: 'pointer'
                            }}
                            title={value.nom}
                            onClick={() => setcurrentPanel(currentPanel?.nom === value.nom ? null : value)}
                        >
                            <FontAwesomeIcon
                                icon={value.icon}
                                style={{
                                    fontSize: 25
                                }}
                                color={currentPanel === value ? green[700] : 'grey'}
                            />
                        </Card>
                    ))
                }
            </Stack>
        </Stack >
    )
}

export default SideBar