import { CardMedia } from '@mui/material'
import useIconMapStore from 'stores/iconMap/useIconMapStore';

const IconItem = ({ value }: { value: string,}) => {
    const {onChange} = useIconMapStore();
    const setIconMapData = useIconMapStore(({ set }) => set);

    return (
        <CardMedia
            component="img"
            sx={{
                height: '100%',
                aspectRatio: 1,
            }}
            src={value}
            onClick={(e) => {
                e.stopPropagation();
                setIconMapData({ showImagePicker: false });
                onChange?.(value);
            }}
        />
    )
}

export default IconItem