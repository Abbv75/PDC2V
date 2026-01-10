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

const PopUpContent = ({ popUpData, selectedFields }: PopUpContentProps) => {
    // Filter popUpData based on selectedFields if provided
    const filteredPopUpData = selectedFields && selectedFields.length > 0
        ? popUpData.filter(item => selectedFields.includes(item.label))
        : popUpData;

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

