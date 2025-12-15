import { Fragment } from 'react'
import RegionShapFiles from './RegionShapFiles'
import ProvinceShapFiles from './ProvinceShapFiles'
import CommuneShapFiles from './CommuneShapFiles'
import VillagePoints from './VillagePoints'

const LocaliteElement = () => {
    return (
        <Fragment>
            <RegionShapFiles />
            <ProvinceShapFiles />
            <CommuneShapFiles />
            <VillagePoints />
        </Fragment>
    )
}

export default LocaliteElement