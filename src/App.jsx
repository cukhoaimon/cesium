import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {BillboardGraphics, Clock, EllipsoidGraphics, Entity, Globe, Model, PathGraphics, Viewer} from "resium";
import * as Cesium from "cesium";
import {useEffect, useMemo, useState} from "react";
import {Cartesian3, JulianDate, Transforms, ClockStep, ClockRange} from "cesium";

Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNWRjODYxMS1jYjMzLTQxNjAtOGVhNC1lN2IxMjBiYjYyOTEiLCJpZCI6MzQ3MDE0LCJpYXQiOjE3NTk1NDg5MTh9.1K80Xg1Oa0uAyf__JZG17T-NWTzW7Bcgtb-niLTFjwM"

const modelMatrix = Transforms.eastNorthUpToFixedFrame(Cartesian3.fromDegrees(-95.0, 225.790, 20));

export default function App() {
    const beachCenter = {lon: -90.128, lat: 225.790, alt: 0};

    const sharks = useMemo(() => {
        const list = [];
        for (let i = 0; i < 5; i++) {
            list.push({
                id: i,
                name: `Shark ${i + 1}`,
                radius: 15 + Math.random() * 5,
                speed: 0.001 + Math.random() * 0.04,
                phase: Math.random() * Math.PI * 2,
                color: Cesium.Color.fromRandom({ alpha: 0.9 }),
            });
        }
        return list;
    }, []);

    const [time, setTime] = useState(0);

    // 🎞️ Animate time
    useEffect(() => {
        let frame;
        const animate = () => {
            setTime((t) => t + 0.016);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <Container maxWidth="sm">
            <Box sx={{my: 4}}>
                <Viewer full>
                    {sharks.map((shark) => {
                        // 🐟 Current position
                        const lon =
                            beachCenter.lon +
                            Math.cos(shark.phase + time * shark.speed) * shark.radius;
                        const lat =
                            beachCenter.lat +
                            Math.sin(shark.phase + time * shark.speed) * shark.radius;
                        const alt = 2 + Math.sin(time * shark.speed * 2) * 0.5;

                        const futurePositions = [];
                        const predictDuration = 3; // seconds ahead
                        const stepCount = 15; // smoothness
                        for (let i = 1; i <= stepCount; i++) {
                            const dt = (i / stepCount) * predictDuration;
                            const futureLon =
                                beachCenter.lon +
                                Math.cos(shark.phase + (time + dt) * shark.speed) * shark.radius;
                            const futureLat =
                                beachCenter.lat +
                                Math.sin(shark.phase + (time + dt) * shark.speed) * shark.radius;
                            const futureAlt =
                                2 + Math.sin((time + dt) * shark.speed * 2) * 0.5;
                            futurePositions.push(
                                Cesium.Cartesian3.fromDegrees(futureLon, futureLat, futureAlt)
                            );
                        }

                        const currentPos = Cesium.Cartesian3.fromDegrees(lon, lat, alt);

                        return (
                            <>
                                {/* 🦈 Shark */}
                                <Entity
                                    key={`shark-${shark.id}`}
                                    name={shark.name}
                                    position={currentPos}
                                    point={{
                                        pixelSize: 6,
                                        color: shark.color,
                                        outlineColor: Cesium.Color.WHITE,
                                        outlineWidth: 1,
                                    }}
                                    label={{
                                        text: shark.name,
                                        font: "12px sans-serif",
                                        fillColor: Cesium.Color.WHITE,
                                        pixelOffset: new Cesium.Cartesian2(0, -12),
                                    }}
                                />

                                {/* 🔮 Predicted path line */}
                                <Entity
                                    key={`future-${shark.id}`}
                                    polyline={{
                                        positions: [currentPos, ...futurePositions],
                                        width: 2,
                                        material: new Cesium.PolylineDashMaterialProperty({
                                            color: shark.color.withAlpha(0.9),
                                            dashLength: 12,
                                            dashPattern: 0xFFFF,
                                        }),
                                    }}
                                />
                            </>
                        );
                    })}
                </Viewer>
            </Box>
        </Container>
    );
}
