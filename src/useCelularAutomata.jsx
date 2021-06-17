import { useMemo, useState } from "react";
import CellularAutomata from "cellular-automata";
import Rand from "rand-seed";

export const useCelularAutomata = ({ size = [10, 10, 10], rule = '23/3', seed="1" }) => {
    const [_, setState] = useState(null);
    const [iterations, setIterations] = useState(0);

    const ca = useMemo(() => {
        const rng = new Rand(seed);
        const ca = new CellularAutomata(size);
        ca.setOutOfBoundValue(0);
        ca.fillWithDistribution([[0, 50], [1, 50]], () => rng.next());
        ca.setRule(rule);
        return ca;
    }, [size]);

    return {
        iterate(n = 1) {
            console.log("iterating",n)
            ca.iterate(n);
            setIterations(iterations => iterations+n);
            setState(ca);
            // console.log(ca)
        },
        cell(...pos) {
            return ca.array.get(...pos);
        },
        iteration() {
            return iterations;
        },
        cells() {
            return [...ca.array.data];
        }
    };

};
