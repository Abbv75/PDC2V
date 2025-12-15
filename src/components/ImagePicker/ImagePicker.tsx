import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Card, Grid, Stack } from '@mui/joy'
import { CardMedia, ClickAwayListener, Collapse } from '@mui/material'
import { green } from '@mui/material/colors'
import { useContext, useState } from 'react'
import { AppContext } from 'providers'
import IconItem from './IconItem'

const ImagePicker = ({ onchange }: { onchange?: (value: string) => any }) => {
    const { setaddImageIsOpen, iconList } = useContext(AppContext);

    const [isOpen, setisOpen] = useState(false);
    const [selectedIndex, setselectedIndex] = useState(undefined as number | undefined);

    return (
        <Stack>
            <Collapse
                in={isOpen}
                sx={{ position: 'absolute', }}
                orientation='vertical'
                unmountOnExit
            >
                <ClickAwayListener onClickAway={() => (isOpen) && setisOpen(false)} >
                    <Card
                        sx={{
                            width: 90,
                            mx: 2,
                            transform: `translateY(-100%)`,
                            zIndex: 400,
                            p: 1,
                            border: `2px solid ${green[800]}`,
                            justifyContent: "center"
                        }}
                    >
                        <Grid container spacing={1} >
                            <Grid>
                                <Avatar
                                    variant='soft'
                                    size='sm'
                                    sx={{
                                        p: 0.1,
                                        width: 20,
                                        height: 20,
                                        aspectRatio: 1,
                                        border: `1px solid `,
                                        cursor: 'pointer'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setaddImageIsOpen(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </Avatar>
                            </Grid>

                            {iconList.map((value, index) => (
                                <Grid key={index} >
                                    <IconItem
                                        onClick={() => {
                                            setisOpen(false);
                                            setselectedIndex(index == selectedIndex ? undefined : index);
                                            onchange && onchange(value);
                                        }}
                                        value={value}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </ClickAwayListener>
            </Collapse>

            <Avatar
                variant='soft'
                size='sm'
                sx={{
                    p: 0.2,
                    width: 15,
                    height: 15,
                    border: `1px solid`,
                    cursor: 'pointer'
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setisOpen(!isOpen);
                }}
            >
                <CardMedia
                    component="img"
                    sx={{ height: '100%', aspectRatio: 1 }}
                    src={selectedIndex ? iconList[selectedIndex] : iconList[1]}
                />
            </Avatar>
        </Stack>
    )
}

export default ImagePicker