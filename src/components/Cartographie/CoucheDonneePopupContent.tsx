import { blue } from  "@mui/material/colors" ;

export const CoucheDonneePopupContent = (key: string, value: string) => {
  return (
    `<div
      style='
        display:  flex ;
        flex-direction:  row ;
        align-items:  center ;
        justify-content:  space-between ;
        gap: 10px;
        width: 250px
      '
    >
      <p
        style='
          max-width:  75% ;
          color: ${blue[600]};
          font-size: 11px;
          font-weight: 700
        '
      >
        ${key}
      </p>
      <p
        style='
          min-width:  25% ;
          font-size: 11px;
          text-align:  right 
        '
      >
        ${value}
      </p>
    </div>
    <hr/>`
  )
}