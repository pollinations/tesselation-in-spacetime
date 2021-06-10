import React, { useReducer, useState } from "react";
import ReactDOM from "react-dom";

import { useInterval } from "react-use";
import { Cube } from "./Cube";
import { map3D } from "./utils";
import { useCelularAutomata } from "./useCelularAutomata";

const startTime = 1623359462896;
const changeEvery = 30; // in seconds

export const range = n => [...Array(n).keys()];


const Cubes = ({reachedIteration, cell, size }) => {


    return (<> { 
        map3D(size, (x,y,z) => cell(x,y,z) ? <Cube disabled={!reachedIteration} key={`${x}_${y}_${z}`} pos={[x, y, z-5]} /> : null)}
            </>);
}

const App = () => {
    const [reachedIteration, setReachedIteration] = useState(false);
    const size = [10,10,10];
    const {cell, iterate, iteration} = useCelularAutomata({size});

    useInterval(() => {
        const timeDifference = (new Date().getTime() - startTime) / 1000;
        const desiredIteration = Math.floor(timeDifference / changeEvery);
        // console.log(desiredIteration);
        if (iteration() < desiredIteration)
            iterate();
        else 
            setReachedIteration(_ => true);
        
    }, 100)


    return (
    <>
        <div className="legend">Rule #23/3</div>
        <div className="legend">Iteration {iteration()} </div>
            <div id="plane-wrapper">
            <div className="spacer"></div>
            <div id="plane">
                <Cubes {...{cell, reachedIteration, size}} />
            </div>
        </div>
    </>);
}

const container = document.getElementById("react_root");
ReactDOM.render(<App />, container);
