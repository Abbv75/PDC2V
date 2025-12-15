import React, { useMemo } from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

import {
    SHAPE_OBJECT_T,
    GET_ALL_FEUILLE,
} from "types";

const styles = StyleSheet.create({
    page: { padding: 20, fontSize: 12, fontFamily: "Helvetica" },
    section: { marginBottom: 15 },
    title: { fontSize: 16, marginBottom: 10, fontWeight: "bold" },
    subtitle: { fontSize: 14, marginBottom: 6, fontWeight: "bold" },
    text: { marginBottom: 4 },
    listItem: { marginLeft: 10, marginBottom: 2 },
    bold: { fontWeight: "bold" },
});

const isValidPoint = (point: any): boolean => {
    const hasLngLat =
        point.longitude !== undefined &&
        point.latitude !== undefined &&
        point.longitude !== null &&
        point.latitude !== null &&
        point.longitude !== "" &&
        point.latitude !== "";

    const hasLgLt =
        point.LG !== undefined &&
        point.LT !== undefined &&
        point.LG !== null &&
        point.LT !== null &&
        point.LG !== "" &&
        point.LT !== "";

    return hasLngLat || hasLgLt;
};

interface RapportDocumentProps {
    coucheDeDonneesSelectedListe: SHAPE_OBJECT_T[];
    allRequeteCartoSelected: any[]; // si besoin on peut typer plus précisément
    ficheTitleSelected: string[];
    ficheDynamiquesData: { title: string, icon: any }[];
    getAllFicheData: null | GET_ALL_FEUILLE;
}

const RapportDocument: React.FC<RapportDocumentProps> = ({
    coucheDeDonneesSelectedListe,
    allRequeteCartoSelected,
    ficheTitleSelected,
    ficheDynamiquesData,
    getAllFicheData,
}) => {
    const hasCouches = coucheDeDonneesSelectedListe.length > 0;

    // Comptage des points pour chaque fiche sélectionnée
    const fichePointCounts = useMemo(() => {
        if (!getAllFicheData) return [];

        return ficheTitleSelected
            .map((title) => {
                const ficheEntries = getAllFicheData[title];
                if (!ficheEntries) return null;

                let countPoints = 0;
                ficheEntries.forEach((entry) => {
                    // entry.data est un tableau
                    if (entry.data && Array.isArray(entry.data)) {
                        countPoints += entry.data.filter(isValidPoint).length;
                    }
                });

                return { title, count: countPoints };
            })
            .filter((item) => item !== null) as { title: string; count: number }[];
    }, [ficheTitleSelected, getAllFicheData]);


    const hasFicheData = fichePointCounts.length > 0;

    const maxFiche = fichePointCounts.reduce(
        (prev, curr) => (curr.count > prev.count ? curr : prev),
        { title: "", count: 0 }
    );

    // Comptage pour fiches dynamiques (filtrées par sélection)
    const ficheDynamiquePointCounts = useMemo(() => {
        if (!getAllFicheData) return [];

        return ficheDynamiquesData
            .filter((fd) => ficheTitleSelected.includes(fd.title))
            .map(({ title }) => {
                const ficheEntries = getAllFicheData[title];
                if (!ficheEntries) return null;

                let countPoints = 0;
                ficheEntries.forEach((entry) => {
                    if (entry.data && Array.isArray(entry.data)) {
                        countPoints += entry.data.filter(isValidPoint).length;
                    }
                });

                return { title, count: countPoints };
            })
            .filter((item) => item !== null) as { title: string; count: number }[];
    }, [ficheDynamiquesData, ficheTitleSelected, getAllFicheData]);

    const hasFicheDynamiqueData = ficheDynamiquePointCounts.length > 0;

    const maxFicheDynamique = ficheDynamiquePointCounts.reduce(
        (prev, curr) => (curr.count > prev.count ? curr : prev),
        { title: "", count: 0 }
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Rapport des données cartographiques</Text>

                {hasCouches && (
                    <View style={styles.section}>
                        <Text style={styles.subtitle}>Couches de données sélectionnées</Text>
                        {coucheDeDonneesSelectedListe.map((couche, idx) => (
                            <Text key={idx} style={styles.listItem}>
                                - {couche.name}
                            </Text>
                        ))}
                    </View>
                )}

                {hasFicheData && (
                    <View style={styles.section}>
                        <Text style={styles.subtitle}>Fiches de données sélectionnées</Text>
                        {fichePointCounts.map(({ title, count }, idx) => (
                            <Text key={idx} style={styles.listItem}>
                                - {title} : {count} point{count > 1 ? "s" : ""}
                            </Text>
                        ))}
                        <Text style={[styles.text, styles.bold]}>
                            Fiche avec le plus de points : {maxFiche.title} ({maxFiche.count} point
                            {maxFiche.count > 1 ? "s" : ""})
                        </Text>
                    </View>
                )}

                {hasFicheDynamiqueData && (
                    <View style={styles.section}>
                        <Text style={styles.subtitle}>Fiches dynamiques sélectionnées</Text>
                        {ficheDynamiquePointCounts.map(({ title, count }, idx) => (
                            <Text key={idx} style={styles.listItem}>
                                - {title} : {count} point{count > 1 ? "s" : ""}
                            </Text>
                        ))}
                        <Text style={[styles.text, styles.bold]}>
                            Fiche dynamique avec le plus de points : {maxFicheDynamique.title} (
                            {maxFicheDynamique.count} point
                            {maxFicheDynamique.count > 1 ? "s" : ""})
                        </Text>
                    </View>
                )}

                {!hasCouches && !hasFicheData && !hasFicheDynamiqueData && (
                    <Text style={styles.text}>Aucune donnée sélectionnée à afficher.</Text>
                )}
            </Page>
        </Document>
    );
};

export default RapportDocument;
