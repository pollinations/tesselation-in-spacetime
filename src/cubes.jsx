import React from "react";
import { Cube } from "./Cube";
import { map3D } from "./utils";

export const Cubes = ({ reachedIteration, cell, size }) => {
    return (<> {map3D(size, (x, y, z) => cell(x, y, z) ? <Cube disabled={!reachedIteration} key={`${x}_${y}_${z}`} pos={[x, y, z - 5]} /> : null)}
    </>);
};
