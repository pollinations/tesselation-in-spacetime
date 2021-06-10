import React, { useMemo, useReducer, useState } from "react";
import ReactDOM from "react-dom";

import CellularAutomata from "cellular-automata";
import { useInterval } from "react-use";


const range = n => [...Array(n).keys()];
const screenPX = i => i * 50;

const map3D = (size, func) =>
    range(size[0]).map(x => range(size[1]).map(y => range(size[2]).map(z => func(x,y,z))));



const Cube = ({pos}) =>  {
    const [x,y,z] = pos;
    return (<div className="cube" data-layer="0" style={{
        left: `${screenPX(x)}px`,
        top: `${screenPX(y)}px`,
        transform: `translate3d(0px, 0px, ${screenPX(z)}px)`
      }}>
        <div className="face face-1"></div>
        <div className="face face-2"></div>
        <div className="face face-3"></div>
        <div className="face face-4"></div>
        <div className="face face-5"></div>
        <div className="face face-6"></div>
    </div>);
};

const Cubes = () => {
    const size = [10,10,10];
    const {state, iterate} = useCelularAutomata({size});

    useInterval(iterate, 1000)
    // console.log("CAState", state.get(0,0,0));
    if (!state)
        return null;
    return (<> { 
        map3D(size, (x,y,z) => state.get(x,y,z) ? <Cube key={`${x}_${y}_${z}`} pos={[x, y, z-5]} /> : null)}
            </>);
}

const App = () => (
    <>
    <div className="legend">Rule #23/3 hhhh</div>
        <div id="plane-wrapper">
        <div className="spacer"></div>
        <div id="plane">
            <Cubes />
        </div>
        </div>
    </>);

const useCelularAutomata = ({size=[10,10,10]}) => {
    const [state, setState] = useState(null);
    return useMemo(() => {
        const ca = new CellularAutomata(size); 
        ca.setOutOfBoundValue(0);
        ca.fillWithDistribution([[0, 95], [1, 5]]);
        ca.setRule('23/3');
        return {
            iterate(n=1) {
                ca.iterate(n);
                setState(ca.array);
            },
            state
        };
    }, [size]);
};


const container = document.getElementById("react_root");
ReactDOM.render(<App />, container);
