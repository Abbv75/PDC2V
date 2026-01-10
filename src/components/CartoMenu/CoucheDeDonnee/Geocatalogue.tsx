import { Box, Button, ButtonGroup, Checkbox, FormControl, FormLabel, Input, LinearProgress, Modal, ModalClose, ModalDialog, Sheet, Stack, Typography } from "@mui/joy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../providers";
import { SHAPE_OBJECT_T } from "types";
import { getCoucheDonnee } from "functions/API";
import { REACT_APP_SHAPE_FILE_URL } from "constant";
import geocatalogueStore from "stores/geocatalogue/useGeocatalogueStore";
import useCoucheDeDonneeStore from "stores/coucheDeDonnee/useCoucheDeDonneeStore";

const Geocatalogue = () => {
    const {
        setlegendeSection,
        setshowShapeFileColorEditer,
        setShapeFileColorEditerDefaultValues,
        setShapeFileColorEditerSubmitFunction
    } = useContext(AppContext);

    const { 
        data,
         loadingState ,
        } = geocatalogueStore();
    const setGeocatalogueData = geocatalogueStore((state) => state.set);

    const { coucheDeDonneesSelectedListe } = useCoucheDeDonneeStore();
    const setCoucheDeDonneeData = useCoucheDeDonneeStore((state) => state.set);

    const [coucheDonneIsAllCocher, setcoucheDonneIsAllCocher] = useState<boolean>(false);

    // State for element-specific config modal
    const [configModalOpen, setConfigModalOpen] = useState(false);
    const [configElementIndex, setConfigElementIndex] = useState<number | null>(null);

    // Get available fields for current element
    const getElementFields = (index: number): { label: string; value: string }[] => {
        const item = data[index];
        if (!item || !item.metaData) return [];
        return Object.keys(item.metaData).map(key => ({ label: key, value: key }));
    };

    // Get selected fields for current element
    const getSelectedFields = (index: number): string[] => {
        const item = data[index];
        return item?.selectedFields || [];
    };

    // Toggle field selection for current element
    const toggleFieldSelection = (index: number, field: string) => {
        const item = data[index];
        const currentFields = item?.selectedFields || [];
        const newFields = currentFields.includes(field)
            ? currentFields.filter(f => f !== field)
            : [...currentFields, field];

        setGeocatalogueData({
            data: data.map((d, idx) => {
                if (idx === index) {
                    return { ...d, selectedFields: newFields };
                }
                return d;
            })
        });
    };

    // Open config modal for specific element
    const openConfigModal = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfigElementIndex(index);
        setConfigModalOpen(true);
    };

    /** Charger les couches depuis l'API */
    const loadData = async () => {
        try {
            setGeocatalogueData({ loadingState: "En cours de chargement" });
            getCoucheDonnee().then(res => res && setGeocatalogueData({ data: res }));
        } finally {
            setGeocatalogueData({ loadingState: null });
        }
    };

    /** Toggle (activer/désactiver) une couche */
    const toogleElementInCoucheDonnesListe = (element: SHAPE_OBJECT_T) => {
        setCoucheDeDonneeData({
            coucheDeDonneesSelectedListe: coucheDeDonneesSelectedListe.find(({ name }) => name === element.name)
                ? coucheDeDonneesSelectedListe.filter(({ name }) => name !== element.name)
                : [...coucheDeDonneesSelectedListe, element]
        });
    };

    /** Tout cocher ou décocher */
    const toutCocherHandle = () => {
        if (coucheDonneIsAllCocher) {
            setCoucheDeDonneeData({ coucheDeDonneesSelectedListe: [] });
        } else {
            const all: SHAPE_OBJECT_T[] = data.map((value) => ({
                name: value.nom_zone,
                filePath: `${REACT_APP_SHAPE_FILE_URL}/${value.shapefile}`,
                couleur: value.couleur,
                couleur_c: value.couleur_c,
                metaData: {
                    "Nom de la Zone": value.nom_zone,
                    "Description de la Zone": value.description ?? '-',
                    "Superficie": value.superficie,
                }
            }));
            setCoucheDeDonneeData({ coucheDeDonneesSelectedListe: all });
        }
        setcoucheDonneIsAllCocher(!coucheDonneIsAllCocher);
    };

    // pour modifier les couleurs
    const handleEdition = async (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setshowShapeFileColorEditer(true);
            setShapeFileColorEditerDefaultValues({
                backgroundColor: data[index].couleur,
                borderColor: data[index].couleur_c
            });

            const editionFunction = (borderColor?: string, backgroundColor?: string, reset?: boolean) => {

                if (!reset) {
                    setGeocatalogueData({
                        data: data.map((item, idx) => {
                            if (idx === index) {
                                return {
                                    ...item,
                                    couleur: backgroundColor || item.couleur,
                                    couleur_c: borderColor || item.couleur_c
                                }
                            }
                            return item;
                        })
                    });
                } else {
                    setGeocatalogueData({
                        data: data.map((item, idx) => {
                            if (idx === index) {
                                return {
                                    ...item,
                                    couleur: data[index].couleur,
                                    couleur_c: data[index].couleur_c
                                }
                            }
                            return item;
                        })
                    });
                }
                setshowShapeFileColorEditer(false);
            }

            setShapeFileColorEditerSubmitFunction(() => editionFunction);
        } catch (error) {

        }
    }

    /** Mettre à jour la légende */
    useEffect(() => {
        if (coucheDeDonneesSelectedListe.length > 0) {
            const content = (
                <Stack gap={0.5}>
                    {coucheDeDonneesSelectedListe.map((item: SHAPE_OBJECT_T, idx: number) => {
                        return (
                            <Stack key={idx} direction="row" alignItems="center" gap={0.5}>
                                <Box sx={{
                                    width: 10,
                                    aspectRatio: 1,
                                    bgcolor: item.couleur,
                                    border: `2px solid ${item.couleur_c || item.couleur}`
                                }} />
                                <span style={{ fontSize: 12 }}>{item.name}</span>
                            </Stack>
                        )
                    })}
                </Stack>
            );

            setlegendeSection((prev: any) => ({
                ...prev,
                coucheDeDonnee: content
            }));
        } else {
            setlegendeSection((prev: any) => ({
                ...prev,
                coucheDeDonnee: undefined
            }));
        }
    }, [coucheDeDonneesSelectedListe, setlegendeSection]);



    useEffect(() => {
        !data.length && loadData();
    }, []);

    if (loadingState) {
        return (
            <LinearProgress />
        )
    }

    // Get current element data for modal
    const currentElement = configElementIndex !== null ? data[configElementIndex] : null;
    const currentElementFields = configElementIndex !== null ? getElementFields(configElementIndex) : [];
    const currentSelectedFields = configElementIndex !== null ? getSelectedFields(configElementIndex) : [];

    return (
        <Stack
            gap={1}
        >
            {/* Tout cocher */}
            <Sheet variant="outlined" sx={{ p: 1, borderRadius: 10, display: 'flex' }}>
                <Checkbox
                    checked={coucheDonneIsAllCocher}
                    onChange={toutCocherHandle}
                    label={"Tout cocher"}
                    overlay
                />
            </Sheet>

            <ButtonGroup
                orientation="vertical"
                variant="soft"
            >
                {data.map((value, index) => {
                    const isSelected = coucheDeDonneesSelectedListe.find((item: SHAPE_OBJECT_T) => item.name === value.nom_zone);

                    return (
                        <Button
                            key={index}
                            variant={isSelected ? "solid" : "soft"}
                            onClick={() => toogleElementInCoucheDonnesListe({
                                name: value.nom_zone,
                                filePath: `${REACT_APP_SHAPE_FILE_URL}/${value.shapefile}`,
                                couleur: value.couleur,
                                couleur_c: value.couleur_c,
                                metaData: {
                                    "Nom de la Zone": value.nom_zone,
                                    "Description de la Zone": value.description ?? '-',
                                    "Superficie": value.superficie,
                                }
                            })}
                            color={isSelected ? "success" : "neutral"}
                            size="sm"
                            sx={{ fontSize: 12, justifyContent: 'space-between' }}
                            startDecorator={<Box
                                sx={{
                                    width: 10,
                                    aspectRatio: 1,
                                    bgcolor: value.couleur,
                                    border: `2px solid ${value.couleur_c || value.couleur || 'black'}`
                                }}
                                onClick={(e) => handleEdition(index, e)}
                            />}
                            endDecorator={
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Box
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: 'action.hover' },
                                            borderRadius: 1
                                        }}
                                        onClick={(e) => openConfigModal(index, e)}
                                    >
                                        <FontAwesomeIcon icon={faCog} size="xs" />
                                    </Box>
                                </Box>
                            }
                        >
                            <p style={{ flex: 1, textAlign: "left" }}>{value.nom_zone}</p>
                        </Button>
                    );
                })}
            </ButtonGroup>

            {/* Element-specific Config Modal */}
            <Modal
                open={configModalOpen}
                onClose={() => {
                    setConfigModalOpen(false);
                    setConfigElementIndex(null);
                }}
            >
                <ModalDialog
                    sx={{
                        width: '80%',
                        minWidth: 350,
                        maxWidth: 600,
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}
                >
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
                        <Typography
                            children={`Configuration: ${currentElement?.nom_zone || ''}`}
                            level="h4"
                        />
                        <ModalClose />
                    </Stack>

                    {/* Section 1: Colors */}
                    <Typography level="title-md" sx={{ mb: 1 }}>
                        Couleurs et bordures
                    </Typography>
                    <Stack direction="row" spacing={2} mb={2}>
                        <FormControl>
                            <FormLabel children="Couleur de fond" />
                            <Input
                                type='color'
                                value={currentElement?.couleur || '#000000'}
                                onChange={({ target }) => {
                                    if (configElementIndex !== null) {
                                        setGeocatalogueData({
                                            data: data.map((item, idx) => {
                                                if (idx === configElementIndex) {
                                                    return { ...item, couleur: target.value };
                                                }
                                                return item;
                                            })
                                        });
                                    }
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel children="Couleur de bordure" />
                            <Input
                                type='color'
                                value={currentElement?.couleur_c || currentElement?.couleur || '#000000'}
                                onChange={({ target }) => {
                                    if (configElementIndex !== null) {
                                        setGeocatalogueData({
                                            data: data.map((item, idx) => {
                                                if (idx === configElementIndex) {
                                                    return { ...item, couleur_c: target.value };
                                                }
                                                return item;
                                            })
                                        });
                                    }
                                }}
                            />
                        </FormControl>
                    </Stack>

                    {/* Section 2: Fields Selection */}
                    <Typography level="title-md" sx={{ mb: 1 }}>
                        Champs affichables
                    </Typography>
                    {currentElementFields.length > 0 ? (
                        <Stack spacing={1}>
                            {currentElementFields.map((field) => (
                                <Checkbox
                                    key={field.value}
                                    checked={currentSelectedFields.includes(field.value)}
                                    onChange={() => {
                                        if (configElementIndex !== null) {
                                            toggleFieldSelection(configElementIndex, field.value);
                                        }
                                    }}
                                    label={field.label}
                                />
                            ))}
                        </Stack>
                    ) : (
                        <Typography level="body-sm" sx={{ py: 2, textAlign: 'center' }}>
                            Aucun champ disponible
                        </Typography>
                    )}

                    <Stack direction="row" justifyContent="flex-end" gap={2} mt={3}>
                        <Button
                            color="success"
                            onClick={() => {
                                setConfigModalOpen(false);
                                setConfigElementIndex(null);
                            }}
                        >
                            Fermer
                        </Button>
                    </Stack>
                </ModalDialog>
            </Modal>
        </Stack>
    );
};

export default Geocatalogue;
