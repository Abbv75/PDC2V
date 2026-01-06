import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Grid, Modal, ModalClose, ModalDialog } from '@mui/joy'
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
                
                <Grid container alignItems={'center'} justifyContent={'center'} spacing={1} >
                    <Grid xs={4} >
                        <FontAwesomeIcon
                            icon={faPlusCircle}
                            onClick={(e) => {
                                e.stopPropagation();
                                setaddImageIsOpen(true);
                            }}
                            fontSize={60}
                        />
                    </Grid>

                    {iconList.map((value, index) => (
                        <Grid key={index} xs={4} >
                            <IconItem
                                value={value}
                            />
                        </Grid>
                    ))}
                </Grid>
            </ModalDialog>
        </Modal>
    )
}
