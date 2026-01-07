import { Grid, Stack } from "@mui/joy"
import Cartographie from "./components/Cartographie"
//@ts-ignore
import "./assets/css/leaflet.css"
import { useEffect, useRef, useState } from "react"
import SideBar from "./components/SideBar"
import { ToastContainer } from "react-toastify"
import { AppContext } from "providers"
import AddIconForm from "features/AddIconForm"
import Header from "components/Header"
import ShapeFileColorEditer from "components/ShapeFileColorEditer"
import NavBar from "components/NavBar"
import useIconMapStore from "stores/iconMap/useIconMapStore"
import ImagePicker2 from "components/ImagePicker2"

export const urlparams = new URLSearchParams(window.location.search);

const App = () => {
  const { loadIconList } = useIconMapStore();

  const [legendeSection, setlegendeSection] = useState({});

  // imagePicker element
  const [addImageIsOpen, setaddImageIsOpen] = useState(false);

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

  useEffect(() => {
    loadIconList();
  }, []);

  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <AppContext.Provider
      value={{
        mapRef,
        legendeSection,
        setlegendeSection,
        addImageIsOpen,
        setaddImageIsOpen,
        showFiligram,
        setshowFiligram,
        showShapeFileColorEditer,
        setshowShapeFileColorEditer,
        setShapeFileColorEditerSubmitFunction,
        ShapeFileColorEditerSubmitFunction,
        ShapeFileColorEditerDefaultValues,
        setShapeFileColorEditerDefaultValues,
      }}
    >
      <Stack
        height={"100vh"}
      >
        <ToastContainer position="top-center" />

        <Header />

        <Grid container flex={1} >
          <Grid height={'100%'} bgcolor={'red'}>
            <NavBar />
          </Grid>

          <Grid flex={1} >
            <Cartographie />
          </Grid>

          <Grid p={1}>
            <SideBar />
          </Grid>
        </Grid>

        <ImagePicker2 />

        {/* <CartoMenu /> */}

        <ShapeFileColorEditer />

        <AddIconForm isOpen={addImageIsOpen} setIsOpen={setaddImageIsOpen} />

      </Stack>
    </AppContext.Provider >
  )
}

export default App