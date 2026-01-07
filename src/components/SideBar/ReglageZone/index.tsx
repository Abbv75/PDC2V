import { memo } from 'react';
import NomShapefile from './NomShapefile';
import KeysToHide from './keysToHide';

export default memo(() => {
    return (
        <>
            <NomShapefile />
            <KeysToHide />
        </>
    );
})