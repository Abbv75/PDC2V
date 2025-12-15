import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, ModalClose, ModalDialog, Stack, Typography } from '@mui/joy'
import createIcon from 'functions/API/icon/createIcon'
import { AppContext } from 'providers'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'

type USE_STATE_T = React.Dispatch<React.SetStateAction<boolean>>

const AddIconForm = ({ isOpen = true, setIsOpen }: { isOpen: boolean, setIsOpen: USE_STATE_T }) => {
    const { loadIconList } = useContext(AppContext);

    const [files, setFiles] = useState<FileList | null>(null)
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!files || files.length === 0) {
            toast.info('Veuillez sélectionner au moins un fichier.')
            return
        }

        setLoading(true)

        try {
            const formData = new FormData()
            Array.from(files).forEach((file) => {
                formData.append('imageFiles[]', file)
            })

            const response = await createIcon(formData)

            if (!response) {
                toast.error('Erreur lors de l\'envoi des données');
                return
            }

            toast.success('Fichiers envoyés avec succès !')
            loadIconList();
            setIsOpen(false)
        } catch (error: any) {
            console.log(`Erreur lors de l'envoi : ${error.message || error}`);
            toast.error('Erreur lors de l\'envoi des données');
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <ModalDialog>
                <Typography level="h4">Ajouter des nouvelles images d'icone</Typography>
                <ModalClose />

                <Stack
                    component="form"
                    gap={2}
                    onSubmit={onSubmit}
                    noValidate
                    encType="multipart/form-data"
                >
                    <input
                        type="file"
                        name="imageFiles[]"
                        multiple={true}
                        accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                        onChange={e => setFiles(e.target.files)}
                    />
                    <Button
                        type="submit"
                        endDecorator={<FontAwesomeIcon icon={faPaperPlane} />}
                        disabled={loading}
                    >
                        {loading ? 'Envoi...' : 'Valider'}
                    </Button>
                </Stack>
            </ModalDialog>
        </Modal>
    )
}

export default AddIconForm
