import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Grid, Modal, ModalClose, ModalDialog } from '@mui/joy'
import { useContext } from 'react'
import { AppContext } from 'providers'
import IconItem from './IconItem'
import useIconMapStore from 'stores/iconMap/useIconMapStore'

export default () => {
    const { setaddImageIsOpen } = useContext(AppContext);

    const { iconList, showImagePicker, set} = useIconMapStore();

    return (
        <Modal
            open={showImagePicker}
            onClose={()=>set({showImagePicker : false})}
        >
            <ModalDialog>
                <ModalClose/>

                <Box sx={{
                    maxHeight: 400,
                    overflowY: 'auto',
                    pr: 1
                }}>
                    <Grid container alignItems={'center'} justifyContent={'center'} spacing={1} >
                        <Grid xs={3} >
                            <FontAwesomeIcon
                                icon={faPlusCircle}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setaddImageIsOpen(true);
                                }}
                                fontSize={40}
                                style={{ cursor: 'pointer' }}
                            />
                        </Grid>

                        {iconList.map((value, index) => (
                            <Grid key={index} xs={3} >
                                <IconItem
                                    value={value}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </ModalDialog>
        </Modal>
    )
}
