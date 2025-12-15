import { Avatar } from '@mui/joy'
import { CardMedia } from '@mui/material'
import { orange } from '@mui/material/colors'

const IconItem = ({ value, onClick }: { value: string, onClick?: (value?: string) => any }) => {
    return (
        <Avatar
            variant='soft'
            size='sm'
            sx={{
                p: 0.1,
                width: 20,
                height: 20,
                aspectRatio: 1,
                border: `1px solid ${orange[800]} `,
                cursor: 'pointer'
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick && onClick(value);
            }}
        >
            <CardMedia
                component="img"
                sx={{ height: '100%', aspectRatio: 1 }}
                src={value}
            />
        </Avatar>
    )
}

export default IconItem