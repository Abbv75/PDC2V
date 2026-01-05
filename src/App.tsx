import { Stack } from "@mui/joy"
import Cartographie from "./components/Cartographie"
//@ts-ignore
import "./assets/css/leaflet.css"
import { useCallback, useEffect, useRef, useState } from "react"
import { ICON } from "./constant"
import SideBar from "./components/SideBar"
import { ToastContainer } from "react-toastify"
import { GET_ALL_FEUILLE, GET_ALL_REQUETE_CARTE_T, RAPORT_CARTO_T } from "types"
import { AppContext } from "providers"
import AddIconForm from "features/AddIconForm"
import getAllIcon from "functions/API/icon/getAllIcon"
import Header from "components/Header"
import ShapeFileColorEditer from "components/ShapeFileColorEditer"
import CartoMenu from "components/CartoMenu"

export const urlparams = new URLSearchParams(window.location.search);

const App = () => {
  const [allRequeteCartoSelected, setallRequeteCartoSelected] = useState([] as { icon?: any, data: GET_ALL_REQUETE_CARTE_T }[]);
  const [ficheTitleSelected, setficheTitleSelected] = useState([] as string[]);
  const [getAllFicheData, setgetAllFicheData] = useState(null as GET_ALL_FEUILLE | null);
  const [ficheDynamiquesData, setficheDynamiquesData] = useState([] as { title: string, icon: any }[]);
  const [legendeSection, setlegendeSection] = useState({});

  // rapport cartographique
  const [allRapportCartoSelected, setallRapportCartoSelected] = useState<{ data: RAPORT_CARTO_T, color?: string }[]>([]);

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
        ({ file }) => `https://sise-pdc2v.org/icon_carto/${file}`
      ) ?? []]);
    } catch (error) {
      return;
    }
  }, [])

  useEffect(() => {
    loadIconList();
  }, []);

  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <AppContext.Provider
      value={{
        mapRef,
        ficheTitleSelected,
        setficheTitleSelected,
        getAllFicheData,
        setgetAllFicheData,
        ficheDynamiquesData,
        setficheDynamiquesData,
        legendeSection,
        setlegendeSection,
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
      }}
    >
      <Stack
        height={"100vh"}
      >
        <ToastContainer position="top-center" />

        <Header />

        <Stack flex={1} direction="row">
          {/* <NavBar /> */}
          <Cartographie />
        </Stack>

        <CartoMenu />
        <SideBar />

        <ShapeFileColorEditer />

        <AddIconForm isOpen={addImageIsOpen} setIsOpen={setaddImageIsOpen} />

      </Stack>
    </AppContext.Provider >
  )
}

export default App