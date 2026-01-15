
import RegionListe from "../assets/JSON/regionListe.json";
import DepartementListe from "../assets/JSON/departementListe.json";
import aggregerParDepartement from "./aggregerParDepartement";

interface AggregationResult {
    code: string;
    name: string;
    centroid: {
        lat: number;
        lng: number;
    };
    count: number;
}

interface Region {
    code: string;
    name: string;
    codeRegion?: string;
    centroid: {
        lat: number;
        lng: number;
    };
}

export default (data: any[][], keyToFilter: string): AggregationResult[] => {
    const aggregatedByDepartement = aggregerParDepartement(data, keyToFilter);
    
    // Create a map of departement code to count for faster lookup
    const departementCountMap = new Map<string, number>();
    aggregatedByDepartement.forEach(dept => {
        departementCountMap.set(dept.code, dept.count);
    });
    
    // Aggregate by region
    const result: AggregationResult[] = RegionListe.map((region: Region) => {
        // Find all departements in this region
        const departementsInRegion = DepartementListe.filter((dept: Region) => dept.codeRegion === region.code);
        
        // Sum the counts from all departements in the region
        const totalCount = departementsInRegion.reduce((sum: number, dept: Region) => {
            return sum + (departementCountMap.get(dept.code) || 0);
        }, 0);
        
        return {
            ...region,
            count: totalCount,
        };
    });
    
    return result;
}
