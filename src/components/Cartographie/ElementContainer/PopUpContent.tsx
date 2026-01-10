import { blue } from "@mui/material/colors";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { Popup } from "react-leaflet";

export interface PopUpDataItem {
    label: string;
    value: any;
}

interface PopUpContentProps {
    popUpData: PopUpDataItem[];
    selectedFields?: string[];
}

// Fields to hide by default
const DEFAULT_HIDDEN_FIELDS = ['LG', 'LT', 'latitude', 'longitude'];

const PopUpContent = ({ popUpData, selectedFields }: PopUpContentProps) => {
    // Filter popUpData based on selectedFields if provided
    // If selectedFields is provided and has items, only show those fields
    // If selectedFields is not provided or empty, show all fields EXCEPT the default hidden ones
    const filteredPopUpData = selectedFields && selectedFields.length > 0
        ? popUpData.filter(item => selectedFields.includes(item.label))
        : popUpData.filter(item => !DEFAULT_HIDDEN_FIELDS.includes(item.label));

    return (
        <Popup>
            <TableContainer sx={{ maxHeight: 200, width: 280 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 700, fontSize: 11 }}>
                                Champ
                            </TableCell>
                            <TableCell sx={{ bgcolor: 'background.paper', fontWeight: 700, fontSize: 11, textAlign: 'right' }}>
                                Valeur
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPopUpData.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell
                                    sx={{
                                        fontSize: 11,
                                        color: blue[600],
                                        fontWeight: 700,
                                        maxWidth: '50%',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {item.label}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontSize: 11,
                                        textAlign: 'right',
                                        maxWidth: '50%',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {item.value}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Popup>
    );
};

export default PopUpContent;

