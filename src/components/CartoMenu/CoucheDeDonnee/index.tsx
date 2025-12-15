import { Stack, Tab, TabList, TabPanel, Tabs } from "@mui/joy";
import LocaliteCouche from "./LocaliteCouche";
import Geocatalogue from "./Geocatalogue";

const CoucheDeDonnee = () => {

    return (
        <Stack
            gap={1}
        >
            <Tabs defaultValue={1} sx={{ borderRadius: 10, overflow: "hidden" }}>
                <TabList
                    tabFlex={'auto'}
                    sx={{
                        fontWeight: 700,
                        fontSize: 12,
                    }}
                >
                    <Tab value={1} >Couche administrative</Tab>
                    <Tab value={2} >Géocatalogue</Tab>
                </TabList>

                <TabPanel
                    value={1}
                    sx={{
                        maxHeight: 200,
                        overflowY: "scroll",
                        pr: 0.5,
                        mt: 1,
                        "& > *": { textOverflow: "ellipsis", borderColor: "white" }
                    }}
                >
                    <LocaliteCouche />
                </TabPanel>

                <TabPanel
                    value={2}
                    sx={{
                        maxHeight: 200,
                        overflowY: "scroll",
                        pr: 0.5,
                        mt: 1,
                        "& > *": { textOverflow: "ellipsis", borderColor: "white" }
                    }}
                >
                    <Geocatalogue />
                </TabPanel>
            </Tabs>
        </Stack>
    );
};

export default CoucheDeDonnee;
