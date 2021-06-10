import React, { useReducer, useState } from "react";
import ReactDOM from "react-dom";

import { useInterval } from "react-use";
import { useCelularAutomata } from "./useCelularAutomata";
import { Cubes } from "./Cubes2";

const startTime = 1623359462896;
const changeEvery = 30; // in seconds

const size = [10,10,10];

const App = () => {
    const [reachedIteration, setReachedIteration] = useState(false);
    const [timeToNext, setTimeToNext] = useState(Infinity);
    const [desiredIteration, setDesiredIteration] = useState(0);

    const {cell, iterate, iteration} = useCelularAutomata({size});

    useInterval(() => {
        const timeDifference = (new Date().getTime() - startTime) / 1000;
        const desiredIteration = Math.floor(timeDifference / changeEvery);
        setDesiredIteration(_ => desiredIteration);
        setTimeToNext(changeEvery - timeDifference % changeEvery);
        // console.log(desiredIteration);
        if (iteration() < desiredIteration) {
            const stepSize = Math.ceil((desiredIteration - iteration())/5);
            iterate(stepSize);
        } else {
            setReachedIteration(_ => true);
        }
    }, 500)


    return (
    <>
        <div className="legend">Rule #23/3</div>
        <div className="right legend">Time to next iteration: {Math.round(timeToNext*10)/10} </div>
        <div className="legend">Iteration {iteration()} / {desiredIteration} </div>
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
