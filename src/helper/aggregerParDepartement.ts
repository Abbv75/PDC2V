import RegionListe from "../assets/JSON/departementListe.json"


interface Region {
    code: string;
    codeRegion: string;
    name: string;
    centroid: {
        lat: number;
        lng: number;
    };
}

interface AggregationResult {
    code: string;
    name: string;
    centroid: {
        lat: number;
        lng: number;
    };
    count: number;
}


export default (data: any[][], keyToFilter: string): AggregationResult[] => {
    const res: AggregationResult[] = RegionListe.map((region: Region) => {
        // Filter elements that match the region name
        const elements = data.filter(element => element[keyToFilter as any] == region.name);
        const nmbrDelement = elements.length;

        return {
            ...region,
            count: nmbrDelement,
        };
    });

    return res;
}
