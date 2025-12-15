import { Button, ButtonGroup, FormControl, FormLabel, Grid, Input, Modal, ModalClose, ModalDialog, Stack, Typography } from '@mui/joy'
import { AppContext } from 'providers'
import { useContext, useEffect, useState } from 'react'

const ShapeFileColorEditer = () => {
    const {
        setshowShapeFileColorEditer,
        showShapeFileColorEditer,
        ShapeFileColorEditerSubmitFunction,
        ShapeFileColorEditerDefaultValues
    } = useContext(AppContext);

    const [formData, setformData] = useState<{
        borderColor?: string,
        backgroundColor?: string
    }>({
        borderColor: ShapeFileColorEditerDefaultValues?.borderColor,
        backgroundColor: ShapeFileColorEditerDefaultValues?.backgroundColor
    })

    const handleSubmit = () => {
        try {
            ShapeFileColorEditerSubmitFunction?.(formData.borderColor, formData.backgroundColor);
        } catch (error) { }
    }

    const handleReset = () => {
        try {
            ShapeFileColorEditerSubmitFunction?.(undefined, undefined, true);
        } catch (error) { }
    }

    useEffect(() => {
        setformData({
            backgroundColor: ShapeFileColorEditerDefaultValues?.backgroundColor,
            borderColor: ShapeFileColorEditerDefaultValues?.borderColor
        })
    }, [ShapeFileColorEditerDefaultValues])

    return (
        <Modal
            open={showShapeFileColorEditer}
            onClose={() => setshowShapeFileColorEditer(false)}
        >
            <ModalDialog
                sx={{
                    width: '50%',
                    minWidth: 300,
                    maxWidth: 750
                }}
            >
                <Stack
                    direction={'row'}
                    gap={30}
                >
                    <Typography
                        children='Modifier les couleurs du shapeFile'
                        level='h3'
                    />
                    <ModalClose />
                </Stack>

                <Grid container spacing={2} >
                    <Grid xs={12} md={6}>
                        <FormControl>
                            <FormLabel
                                children={'Couleur de fond'}
                            />
                            <Input
                                type='color'
                                value={formData.backgroundColor}
                                onChange={({ target }) => setformData({ ...formData, backgroundColor: target.value })}
                            />
                        </FormControl>
                    </Grid>

                    <Grid xs={12} md={6}>
                        <FormControl>
                            <FormLabel
                                children={'Couleur de bordure'}
                            />
                            <Input
                                type='color'
                                value={formData.borderColor}
                                onChange={({ target }) => setformData({ ...formData, borderColor: target.value })}
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <ButtonGroup variant='solid' >
                    <Button
                        children='Réinitialiser à la valeur par défaut'
                        color='danger'
                        fullWidth
                        onClick={handleReset}
                    />
                    <Button
                        children='Enregistrer les modifications'
                        color='success'
                        fullWidth
                        onClick={handleSubmit}
                    />
                </ButtonGroup>

            </ModalDialog>
        </Modal>
    )
}

export default ShapeFileColorEditer