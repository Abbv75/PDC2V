import { faDownload, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Option, Select, Stack, Typography } from '@mui/joy';
import { green } from '@mui/material/colors';
import { useCallback, useContext, useState } from 'react';
import { AppContext } from 'providers';
import { LOADING_STATE_T } from 'types';

import { PDFDownloadLink } from '@react-pdf/renderer';
import RapportDocument from './RapportDocument'; // Le composant PDF que tu dois créer

const RapportZone = () => {
    const {
        coucheDeDonneesSelectedListe,
        allRequeteCartoSelected,
        ficheTitleSelected,
        ficheDynamiquesData,
        getAllFicheData
    } = useContext(AppContext);

    const [printLoadingState, setprintLoadingState] = useState<LOADING_STATE_T>(null);

    const handleGenerateRapport = useCallback(() => {
        setprintLoadingState('En cours de chargement');
        // ici tu peux déclencher une logique avant la génération si besoin
    }, []);

    return (
        <Stack
            bgcolor={'whitesmoke'}
            p={1}
            borderRadius={8}
            gap={1}
        >
            <Typography>
                Ceci procedera à la génération d'un rapport sur l'état actuel des données de la carte.
            </Typography>

            <Stack direction={'row'} gap={1} >
                <Select defaultValue={'pdf'} >
                    <Option value={'pdf'} ><FontAwesomeIcon icon={faFilePdf} /></Option>
                    <Option value={'word'} >Word</Option>
                    <Option value={'excel'} >Excel</Option>
                </Select>

                <PDFDownloadLink
                    document={
                        <RapportDocument
                            coucheDeDonneesSelectedListe={coucheDeDonneesSelectedListe}
                            allRequeteCartoSelected={allRequeteCartoSelected}
                            ficheTitleSelected={ficheTitleSelected}
                            ficheDynamiquesData={ficheDynamiquesData}
                            getAllFicheData={getAllFicheData}
                        />
                    }
                    style={{width:'100%'}}
                    fileName="Rapport de la cartographie de PDC2V.pdf"
                >
                    {({ loading }) => (
                        <Button
                            sx={{
                                bgcolor: loading ? 'grey' : green[700],
                                color: 'white',
                                ':hover': {
                                    bgcolor: loading ? 'grey' : green[900],
                                },
                            }}
                            fullWidth
                            disabled={loading}
                            endDecorator={<FontAwesomeIcon icon={faDownload} />}
                        >
                            {loading ? 'Compilation...' : 'Télécharger'}
                        </Button>
                    )}
                </PDFDownloadLink>
            </Stack>

        </Stack>
    );
};

export default RapportZone;
