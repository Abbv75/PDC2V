import { Button, Card, Grid, Stack, Typography } from '@mui/joy'
import { CardMedia } from '@mui/material'
import { green, orange } from '@mui/material/colors'
import { IMAGE } from 'constant'

const Header = () => {
    return (
        <Stack>
            <Card sx={{
                borderRadius: 0,
                borderWidth: 0,
                p: 0.5,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }} >
                <Stack direction={'row'} alignItems={'center'} gap={1} >
                    {[IMAGE.logo, IMAGE.bankMondiale, IMAGE.armorieLogo].map(value => (
                        <CardMedia
                            src={value}
                            sx={{ height: '50px', width: '50px', objectFit: 'contain' }}
                            component={'img'}
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

            <Grid container >
                {[orange[600], 'white', green[600]].map((value, index) => (
                    <Grid bgcolor={value} xs={4} p={0.2} />
                ))}
            </Grid>
        </Stack>
    )
}

export default Header