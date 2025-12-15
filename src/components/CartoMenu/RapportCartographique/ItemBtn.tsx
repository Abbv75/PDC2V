import { Button } from '@mui/joy';
import { green } from '@mui/material/colors';
import { AppContext } from 'providers';
import { useContext, useEffect, useState } from 'react';
import { RAPORT_CARTO_T } from 'types';

const ItemBtn = ({ value }: { value: RAPORT_CARTO_T }) => {
    const {
        allRapportCartoSelected,
        setallRapportCartoSelected,
    } = useContext(AppContext);

    const [currentColor, setcurrentColor] = useState<string>(green[400]);

    const toogleElementInSelectedListe = () => {
        let isInListe = allRapportCartoSelected.find(({ data },) => data.code === value.code);

        if (!!isInListe) {
            let res = allRapportCartoSelected.filter(({ data }) => data.code != value.code);

            setallRapportCartoSelected(res);
        }
        else {
            setallRapportCartoSelected(
                (prev) => [...prev, { data: value, color: green[400] }]
            );
        }
    }

    const handleColorChange = () => {
        let isInListe = allRapportCartoSelected.find(({ data }) => data.code === value.code);
        if (!isInListe) return;

        const dataEdited = allRapportCartoSelected.map(element => {
            if (element.data.code === value.code) {
                return { ...element, color: currentColor }
            }
            else {
                return element;
            }
        });
        setallRapportCartoSelected(dataEdited);
    }

    useEffect(() => {
        handleColorChange();
    }, [currentColor]);

    return (
        <Button
            variant={allRapportCartoSelected.find(({ data }) => data.code === value.code) ? "solid" : "soft"}
            onClick={() => toogleElementInSelectedListe()}
            color={allRapportCartoSelected.find(({ data }) => data.code === value.code) ? "success" : "neutral"}
            size="sm"
            sx={{
                fontSize: 12
            }}
            endDecorator={(
                <input
                    type="color"
                    value={currentColor}
                    onClick={(e)=>{
                        e.stopPropagation();
                    }}
                    onChange={(e) => {
                        setcurrentColor(e.target.value);
                    }}
                />
            )}
        >
            <p style={{ width: '100%', textAlign: "left" }} >
                {value.title}
            </p>
        </Button>
    )
}

export default ItemBtn