import { ScaleControl } from 'react-leaflet';

const EchelleControle = () => {
  return (
    <ScaleControl
      position="topleft"
      metric={true}   
      imperial={false}
      maxWidth={100}
    />
  )
}

export default EchelleControle