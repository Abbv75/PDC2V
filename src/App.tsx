import { Stack } from "@mui/joy"
import Cartographie from "./components/Cartographie"
//@ts-ignore
import "./assets/css/leaflet.css"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { COUCHE_DE_DONNEES_LISTE, FOND_DE_CARTE, ICON } from "./constant"
import SideBar from "./components/SideBar"
import { ToastContainer } from "react-toastify"
import { COMMUNE_T, GET_ALL_FEUILLE, GET_ALL_REQUETE_CARTE_T, PROVINCE_T, RAPORT_CARTO_T, REGION_T, VILLAGE_T } from "types"
import { AppContext } from "providers"
import AddIconForm from "features/AddIconForm"
import getAllIcon from "functions/API/icon/getAllIcon"
import Header from "components/Header"
import ShapeFileColorEditer from "components/ShapeFileColorEditer"
import { coucheDeDonneesElementConfig_T } from "types/AppT"
import CartoMenu from "components/CartoMenu"

export const urlparams = new URLSearchParams(window.location.search);

const App = () => {
  const [currentMapSelected, setcurrentMapSelected] = useState(FOND_DE_CARTE[0]);
  const [zoomLevel, setzoomLevel] = useState(7);
  const [allRequeteCartoSelected, setallRequeteCartoSelected] = useState([] as { icon?: any, data: GET_ALL_REQUETE_CARTE_T }[]);
  const [ficheTitleSelected, setficheTitleSelected] = useState([] as string[]);
  const [getAllFicheData, setgetAllFicheData] = useState(null as GET_ALL_FEUILLE | null);
  const [ficheDynamiquesData, setficheDynamiquesData] = useState([] as { title: string, icon: any }[]);
  const [legendeSection, setlegendeSection] = useState({});

  // couche de donnees
  const [coucheDeDonneesSelectedListe, setcoucheDeDonneesSelectedListe] = useState([] as typeof COUCHE_DE_DONNEES_LISTE);
  const [coucheDeDonneesElementConfig, setcoucheDeDonneesElementConfig] = useState<coucheDeDonneesElementConfig_T>({
    showShapefileName: true,
    showShapefilePopup: false
  });

  // rapport cartographique
  const [allRapportCartoSelected, setallRapportCartoSelected] = useState<{ data: RAPORT_CARTO_T, color?: string }[]>([]);

  // localite element
  const [localiteRegionsSelected, setlocaliteRegionsSelected] = useState([] as REGION_T[]);
  const [localiteDepartementsSelected, setlocaliteDepartementsSelected] = useState([] as PROVINCE_T[]);
  const [localiteCommunesSelected, setlocaliteCommunesSelected] = useState([] as COMMUNE_T[]);
  const [localiteVillagesSelected, setlocaliteVillagesSelected] = useState([] as VILLAGE_T[]);

  // imagePicker element
  const [addImageIsOpen, setaddImageIsOpen] = useState(false);
  const [iconList, seticonList] = useState(Object.values(ICON) as string[]);

  // FiliGramZone
  const [showFiligram, setshowFiligram] = useState(false);

  // ShapeFileColorEditer
  const [showShapeFileColorEditer, setshowShapeFileColorEditer] = useState(false);
  const [ShapeFileColorEditerSubmitFunction, setShapeFileColorEditerSubmitFunction] = useState<
    undefined |
    ((borderColor?: string, backgroundColor?: string, reset?: boolean) => any)
  >(undefined);
  const [ShapeFileColorEditerDefaultValues, setShapeFileColorEditerDefaultValues] = useState<{
    borderColor?: string,
    backgroundColor?: string
  } | undefined>(undefined)

  const loadIconList = useCallback(async () => {
    try {
      const res = await getAllIcon();

      seticonList([...Object.values(ICON), ...res?.map(
        ({ file }) => `https://sise-pdc2v.org//icon_carto/${file}`
      ) ?? []]);
    } catch (error) {
      return;
    }
  }, [])

  const localite = useMemo(() => (
    {
      region: localiteRegionsSelected,
      departement: localiteDepartementsSelected,
      commune: localiteCommunesSelected,
      village: localiteVillagesSelected
    }
  ), [localiteRegionsSelected, localiteDepartementsSelected, localiteCommunesSelected, localiteVillagesSelected]);

  useEffect(() => {
    loadIconList();
  }, []);

  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <AppContext.Provider
      value={{
        currentMapSelected,
        mapRef,
        coucheDeDonneesSelectedListe,
        setcoucheDeDonneesSelectedListe,
        setcurrentMapSelected,
        zoomLevel,
        setzoomLevel,
        allRequeteCartoSelected,
        setallRequeteCartoSelected,
        ficheTitleSelected,
        setficheTitleSelected,
        getAllFicheData,
        setgetAllFicheData,
        ficheDynamiquesData,
        setficheDynamiquesData,
        legendeSection,
        setlegendeSection,
        localite,
        setlocaliteRegionsSelected,
        setlocaliteDepartementsSelected,
        setlocaliteCommunesSelected,
        setlocaliteVillagesSelected,
        addImageIsOpen,
        setaddImageIsOpen,
        loadIconList,
        iconList,
        showFiligram,
        setshowFiligram,
        showShapeFileColorEditer,
        setshowShapeFileColorEditer,
        setShapeFileColorEditerSubmitFunction,
        ShapeFileColorEditerSubmitFunction,
        ShapeFileColorEditerDefaultValues,
        setShapeFileColorEditerDefaultValues,
        allRapportCartoSelected,
        setallRapportCartoSelected,
        coucheDeDonneesElementConfig,
        setcoucheDeDonneesElementConfig
      }}
    >
      <Stack
        height={"100vh"}
      >
        <ToastContainer position="top-center" />

        <Header />

        <SideBar />

        <ShapeFileColorEditer />

        <CartoMenu />

        <Cartographie />

        <AddIconForm isOpen={addImageIsOpen} setIsOpen={setaddImageIsOpen} />

      </Stack>
    </AppContext.Provider >
  )
}

export default App