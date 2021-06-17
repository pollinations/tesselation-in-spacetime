import React, { createFactory, useReducer, useState } from "react";
import ReactDOM from "react-dom";

import { useInterval } from "react-use";
import { useCelularAutomata } from "./useCelularAutomata";
import { Cubes } from "./Cubes2";
import {useSearchParam} from 'react-use';
import exportSTL from "./createSTL/createSTL";

const startTime = 1623859266065;
const changeEvery = 30; // in seconds

const size = [7,7,7];

const seed="41";

const App = () => {
    const [reachedIteration, setReachedIteration] = useState(false);
    const [timeToNext, setTimeToNext] = useState("---");

    const [rule, setRule] = useState("345/2232");

    

    const {cell, iterate, iteration, cells} = useCelularAutomata({size, rule, seed});

    const enableWarmup = useSearchParam("nowarmup")  === null;
    
    const overrideIteration = useSearchParam("iteration") === null ? null : parseInt(useSearchParam("iteration"));

    const createSTL = !(useSearchParam("stl")  === null);

    useInterval(() => {
        const timeDifference = (new Date().getTime() - startTime) / 1000;
        const desiredIteration = overrideIteration !== null ? overrideIteration : Math.floor(timeDifference / changeEvery);

        if (iteration() < desiredIteration && enableWarmup) {
            const stepSize = Math.ceil((desiredIteration - iteration())/3);
            iterate(stepSize);
        } else {
            setTimeToNext(Math.floor((changeEvery - timeDifference % changeEvery)));
            setReachedIteration(_ => true);
        }
    }, 1000)

    let stl=null;
    if (createSTL) {
        console.log(cells())
        stl = "data: text/json;charset=utf-8,"+exportSTL({cells: cells(), width: size[0], binary: false});
    }
    // var obj = {a: 123, b: "4 5 6"};
    // var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    
    // $('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo('#container');

    return (
    <>
        <div className="legend"><span className="label">Rule&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> {rule}</div>
        <div className="legend"><span className="label">Iteration</span> {iteration()}</div>
        <div className="right legend"> <span className="label">Next(sec)</span> {timeToNext}</div>
        {exportSTL && <div className="legend"><a href={stl} download="cellular_nft.stl">download STL</a></div>}
            <div id="plane-wrapper">
            <div className="spacer"></div>
            <div id="plane">
                <Cubes {...{cell, reachedIteration, size, timeToNext}} />
            </div>
        </div>
    </>);
}

const container = document.getElementById("react_root");
ReactDOM.render(<App />, container);
