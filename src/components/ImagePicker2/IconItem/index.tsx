import { CardMedia } from '@mui/material'
import useIconMapStore from 'stores/iconMap/useIconMapStore';

const IconItem = ({ value }: { value: string,}) => {
    const {onChange} = useIconMapStore();
    const setIconMapData = useIconMapStore(({ set }) => set);

    return (
        <CardMedia
            component="img"
            sx={{
                height: 60,
                width: 60,
                objectFit: 'contain',
                cursor: 'pointer',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                p: 0.5,
                transition: 'transform 0.2s, border-color 0.2s',
                '&:hover': {
                    transform: 'scale(1.1)',
                    borderColor: 'primary.main',
                },
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
