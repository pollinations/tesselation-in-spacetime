import React, { createFactory, useReducer, useState } from "react";
import ReactDOM from "react-dom";

import { useInterval } from "react-use";
import { useCelularAutomata } from "./useCelularAutomata";
import { Cubes } from "./Cubes2";
import {useSearchParam} from 'react-use';
import exportSTL from "./createSTL/createSTL";

const startTime = 1624194000000;
const changeEvery = 180; // in seconds

const size = [7,7,7];

const seed="mjhjhjhjhjhh";

const App = () => {
    const [reachedIteration, setReachedIteration] = useState(false);
    const [timeToNext, setTimeToNext] = useState("---");

    const [rule, setRule] = useState("5678/6789");


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

        stl = "data: text/json;charset=utf-8,"+exportSTL({cells: cells(), width: size[0], binary: false, iteration});
    }

    return (
    <>
        <div className="legend"><span className="label">Rule&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> {rule}</div>
        <div className="legend"><span className="label">Iteration</span> {iteration()}</div>
        <div className="right legend"> <span className="label">Next</span> {timeToNext}</div>
        {createSTL && <div className="legend"><a href={stl} download={`cellular_nft_iteration_${iteration()}_rule_${rule.replace("/","_")}.stl`}>Download STL</a></div>}
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
