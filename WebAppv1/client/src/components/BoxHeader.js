import FlexBetween from './FlexBetween'
import {Box, Typography} from "@mui/material"

const BoxHeader = ({icon, title, subtitle, sideText}) => {
  return (
    <FlexBetween color="#a2a7ab" margin="1.5rem 1rem 0 1rem"
    >
        <FlexBetween>{icon}
        <Box width="100%">
            <Typography variant="h7" mb="-0.1rem" color="black">
                {title}
            </Typography>
            <Typography style={{ fontSize: '0.7rem' }} >
                {subtitle}
            </Typography>
        </Box>
        </FlexBetween>
        <Typography variant="h9" fontWeight="700" color="#31d6ad">
                {sideText}
        </Typography>
    </FlexBetween>
  )
}

export default BoxHeader