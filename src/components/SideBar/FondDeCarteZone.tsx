import { Divider, Radio, Stack } from '@mui/joy'
import { grey } from '@mui/material/colors'
import { FOND_DE_CARTE } from 'constant'
import { Fragment } from 'react/jsx-runtime'
import { useContext, useState } from 'react'
import { AppContext } from '../../providers'

const FondDeCarteZone = () => {
    const [currentIndex, setcurrentIndex] = useState(0);
    const { setcurrentMapSelected } = useContext(AppContext);

    return (
        <Stack
            gap={1}
            p={0.5}
            bgcolor={grey[300]}
            borderRadius={8}
            maxHeight={450}
            sx={{
                overflowY: 'scroll'
            }}
        >
            {
                FOND_DE_CARTE.map((value, index) => (
                    <Fragment>
                        <Radio
                            label={value.nom}
                            checked={currentIndex === index}
                            onChange={({ target }) => {
                                if (target.checked) {
                                    setcurrentIndex(index);
                                    setcurrentMapSelected(FOND_DE_CARTE[index]);
                                }
                            }}
                            sx={{
                                fontSize: 11
                            }}
                            size='sm'
                            color='success'
                            title={value.description}
                        />
                        <Divider />
                    </Fragment>
                ))
            }
        </Stack>
    )
}

export default FondDeCarteZone