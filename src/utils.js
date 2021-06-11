
export const map3D = (size, func) => range(size[0]).map(x => range(size[1]).map(y => range(size[2]).map(z => func(x, y, z))));

export const range = n => [...Array(n).keys()];

export const screenPX = i => i * 25;