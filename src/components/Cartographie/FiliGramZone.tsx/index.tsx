import { CardMedia } from '@mui/material'
import { IMAGE } from 'constant'
import { AppContext } from 'providers'
import React, { Fragment, useContext } from 'react'

const FiliGramZone = () => {
    const { showFiligram } = useContext(AppContext)

    if (!showFiligram) {
        return <React.Fragment />
    }

    return <Fragment />

    // return (
    //     <CardMedia
    //         component={'img'}
    //         src={IMAGE.logo}
    //         sx={{
    //             position: "fixed",
    //             bottom: 100,
    //             left: 0,
    //             height: 100,
    //             width: 100,
    //             zIndex: 400,
    //             bgcolor: "white",
    //             borderRadius: 100
    //         }}
    //     />
    // )
}

export default FiliGramZone