import {Box, useMediaQuery} from "@mui/material"
import Row1 from "./Row1"
import Row2 from "./Row2"

// The grid template for a large screen > 1200px
const gridTemplateLargeScreen = `
    "a b c"
    "a b c"
    "a b c"
    "g g f"
    "d e f"
    "d e f"
`
// Template for small screens, we just want to display them consecutively
const gridTemplateSmallScreen = `
    "a"
    "a"
    "a"
    "a"
    "b"
    "b"
    "b"
    "b"
    "c"
    "c"
    "c"
    "d"
    "d"
    "d"
    "e"
    "e"
    "f"
    "f"
    "f"
`

const Dashboard = () => {
    // Checking the screensize
    const isAboveMediumScreens = useMediaQuery("(min-width:1200px)")
  return (
    <Box width="100%" height="100%" display="grid" gap="1.5rem" bgcolor="f1f1f1"
    // Additional css styles for the grids conditionally
    sx={
        isAboveMediumScreens ?{     
        gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
        gridTemplateRows: "repeat(6, minmax(60px, 1fr))",
        gridTemplateAreas: gridTemplateLargeScreen,
    }:{
        gridAutoColumns: "1fr",
        gridAutoRows: "80px",
        gridTemplateAreas: gridTemplateSmallScreen,
    }}>
        <Row1/>
        <Row2/> 
    </Box>
  )
}

export default Dashboard