import { Avatar, Button, Card, Stack, Typography } from '@mui/joy'
import { CardMedia } from '@mui/material'
import { IMAGE } from 'constant'

const Header = () => {
    return (
        <Card sx={{
            borderRadius: 0,
            p: 0.5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }} >
            <Stack direction={'row'} alignItems={'center'} gap={1} >
                {[IMAGE.logo, IMAGE.minister, IMAGE.jhgv].map(value => (
                    <Avatar
                        children={(
                            <CardMedia
                                src={value}
                                sx={{ width: '100%', height: '100%' }}
                                component={'img'}
                            />
                        )}
                        size='lg'
                    />
                ))}

                <Typography level='h1' fontSize={15} width={300}>
                    Projet de Développement des Chaînes de Valeurs Vivrières (PDC2V)
                </Typography>
            </Stack>

            <Button
                children="Aller sur ruche"
                size='sm'
                color='success'
                variant='plain'
                onClick={() => {
                    window.location.href = 'https://sise-pdc2v.org/'
                }}
            />

        </Card>
    )
}

export default Header