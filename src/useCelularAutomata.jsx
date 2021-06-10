import { useMemo, useState } from "react";
import CellularAutomata from "cellular-automata";

export const useCelularAutomata = ({ size = [10, 10, 10] }) => {
    const [_, setState] = useState(null);
    const [iterations, setIterations] = useState(0);

    const ca = useMemo(() => {
        const ca = new CellularAutomata(size);
        ca.setOutOfBoundValue(0);
        ca.fillWithDistribution([[0, 95], [1, 5]]);
        ca.setRule('23/3');
        return ca;
    }, [size]);

    return {
        iterate(n = 1) {
            ca.iterate(n);
            setIterations(iterations => iterations+1);
            setState(ca);
        },
        cell(...pos) {
            return ca.array.get(...pos);
        },
        iteration() {
            return iterations;
        }
    };

};
