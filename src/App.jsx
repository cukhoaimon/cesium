import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {Viewer} from "resium";
import * as Cesium from "cesium";

Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNWRjODYxMS1jYjMzLTQxNjAtOGVhNC1lN2IxMjBiYjYyOTEiLCJpZCI6MzQ3MDE0LCJpYXQiOjE3NTk1NDg5MTh9.1K80Xg1Oa0uAyf__JZG17T-NWTzW7Bcgtb-niLTFjwM"

export default function App() {
    return (
        <Container maxWidth="sm">
            <Box sx={{my: 4}}>
                <Viewer full/>
            </Box>
        </Container>
    );
}
