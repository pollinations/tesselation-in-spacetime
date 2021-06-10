import React from "react";


export const Cube = ({ pos, disabled }) => {
    const [x, y, z] = pos;
    return (<div className={"cube " + (disabled ? "disabled" : "")} data-layer="0" style={{
        transform: `translate3d(${screenPX(x)}px, ${screenPX(y)}px, ${screenPX(z)}px)`
    }}>
        <div className="face face-1"></div>
        <div className="face face-2"></div>
        <div className="face face-3"></div>
        <div className="face face-4"></div>
        <div className="face face-5"></div>
        <div className="face face-6"></div>
    </div>);
};


const screenPX = i => i * 50;