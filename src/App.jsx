import React, { useReducer, useState } from "react";
import ReactDOM from "react-dom";

import { useInterval } from "react-use";
import { useCelularAutomata } from "./useCelularAutomata";
import { Cubes } from "./Cubes2";
import {useSearchParam} from 'react-use';

const startTime = 1623359462896;
const changeEvery = 30; // in seconds

const size = [10,10,10];

const App = () => {
    const [reachedIteration, setReachedIteration] = useState(false);
    const [timeToNext, setTimeToNext] = useState("---");
    const [desiredIteration, setDesiredIteration] = useState(0);

    const {cell, iterate, iteration} = useCelularAutomata({size});

    const enableWarmup = useSearchParam("nowarmup")  === null;
    

    useInterval(() => {
        const timeDifference = (new Date().getTime() - startTime) / 1000;
        const desiredIteration = Math.floor(timeDifference / changeEvery);
        setDesiredIteration(_ => desiredIteration);
        
        // console.log(desiredIteration);
        if (iteration() < desiredIteration && enableWarmup) {
            const stepSize = Math.ceil((desiredIteration - iteration())/5)+1;
            iterate(stepSize);
        } else {
            setTimeToNext(Math.round((changeEvery - timeDifference % changeEvery)*10)/10);
            setReachedIteration(_ => true);
        }
    }, 500)


    return (
    <>
        <div className="legend"><span className="label">Rule&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> #23/3</div>
        <div className="legend"><span className="label">Iteration</span> {iteration()}</div>
        <div className="right legend"> <span className="label">Next(sec)</span> {timeToNext}</div>

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
