import { Button, Card } from '@mui/joy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { CARTO_MENU_EN_TETE_ZONE } from 'constant'
import NavbarItem from './NavbarItem'
import { useState } from 'react'

export default () => {
    const [isOpen, setisOpen] = useState(true);

    return (
        <Card
            sx={{
                borderRadius: 0,
                p: 1,
                width: isOpen ? 400 : 50,
                gap: 3,
                overflowY : 'auto',
                height: 'calc(100% - 40px)',
            }}
            variant="outlined"
        >
            <Button
                sx={{
                    gap: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: isOpen ? 'flex-end' : 'center',
                    padding: 0,
                    borderRadius: 100,
                    fontSize: 20,
                    aspectRatio: '1/1',
                }}
                color='danger'
                variant='soft'
                onClick={() => setisOpen(!isOpen)}
            >
                <FontAwesomeIcon icon={faTimesCircle} />
            </Button>

            {CARTO_MENU_EN_TETE_ZONE.map((item, index) => (
                <NavbarItem
                    isNavbarOpen={isOpen}
                    setisNavbarOpen={setisOpen}
                    item={item}
                    key={index}
                />
            ))}
        </Card>
    )
}
