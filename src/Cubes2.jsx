import React from "react";
import { Cube } from "./Cube";
import { map3D } from "./utils";

export const Cubes = ({ reachedIteration, cell, size,timeToNext }) => {

    const disabled = !reachedIteration || flashWhenCloseToNext(timeToNext);

    return (<> {map3D(size, (x, y, z) => cell(x, y, z) ? <Cube disabled={disabled} key={`${x}_${y}_${z}`} pos={[x, y, z-2]} /> : null)}
    </>);
};
function flashWhenCloseToNext(timeToNext) {
    return timeToNext < 0.55;
}

