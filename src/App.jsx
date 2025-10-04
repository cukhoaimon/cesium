import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from './ProTip';
import Copyright from './Copyright';
import {Viewer} from "resium";

export default function App() {
    return (
        <Container maxWidth="sm">
            <Box sx={{my: 4}}>
                <Viewer full/>
            </Box>
        </Container>
    );
}
