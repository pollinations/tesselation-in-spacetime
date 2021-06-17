
import stereol from 'stereol'

const defaultWalls = {
    bottom: true,
    top: true,
    back: true,
    front: true,
    left: true,
    right: true
}

const createCube = ({ origins, size, height, walls = defaultWalls, color = 0 }) => {
    const [posx, posy, posz] = origins
    const shouldDraw = { ...defaultWalls, ...walls }
    const facets = []

    if (shouldDraw.bottom) {
        facets.push({
            verts: [
                [posx, posy, posz],
                [posx, posy + size, posz],
                [posx + size, posy + size, posz],
            ]
        }, {
            verts: [
                [posx, posy, posz],
                [posx + size, posy + size, posz],
                [posx + size, posy, posz],
            ]
        })
    }

    if (shouldDraw.top) {
        facets.push({
            verts: [
                [posx, posy + size, posz + height],
                [posx, posy, posz + height],
                [posx + size, posy + size, posz + height],
            ]
        }, {
            verts: [
                [posx + size, posy + size, posz + height],
                [posx, posy, posz + height],
                [posx + size, posy, posz + height],
            ]
        })
    }

    if (shouldDraw.back) {
        facets.push({
            verts: [
                [posx, posy, posz],
                [posx + size, posy, posz],
                [posx + size, posy, posz + height],
            ]
        }, {
            verts: [
                [posx, posy, posz],
                [posx + size, posy, posz + height],
                [posx, posy, posz + height],
            ]
        })
    }

    if (shouldDraw.front) {
        facets.push({
            verts: [
                [posx + size, posy + size, posz],
                [posx, posy + size, posz],
                [posx + size, posy + size, posz + height],
            ]
        }, {
            verts: [
                [posx + size, posy + size, posz + height],
                [posx, posy + size, posz],
                [posx, posy + size, posz + height],
            ]
        })
    }

    if (shouldDraw.left) {
        facets.push({
            verts: [
                [posx, posy + size, posz + height],
                [posx, posy, posz],
                [posx, posy, posz + height],
            ]
        }, {
            verts: [
                [posx, posy + size, posz],
                [posx, posy, posz],
                [posx, posy + size, posz + height],
            ]
        })
    }

    if (shouldDraw.right) {
        facets.push({
            verts: [
                [posx + size, posy, posz],
                [posx + size, posy + size, posz + height],
                [posx + size, posy, posz + height],
            ]
        }, {
            verts: [
                [posx + size, posy, posz],
                [posx + size, posy + size, posz],
                [posx + size, posy + size, posz + height],
            ]
        })
    }

    return facets.map(f => ({ ...f, color }))
}

/**
 * Creates a 3D printable QRCode as .stl file content
 * @param {Object} opts - Options object
 * @param {String} opts.text - The string to encode into QRCode
 * @param {Number} [opts.bitSize=4] - Width/Depth (mm) of the cells composing the QRcode grid
 * @param {Number} [opts.height=2] - Height (mm) of the qrcode part
 * @param {Number} [opts.base=2] - Height (mm) of the solid base part
 * @param {Boolean} [opts.binary=false] - Sould output the .stl content as ASCII (default) or binary
 * @param {Array} [opts.baseColor=[0,0,0]] - Only if binary is true. RGB Array where R, G, and B are all 5 bits integers (between 0 and 31)
 * @param {Array} [opts.qrColor=[31,0,0]] - Only if binary is true. RGB Array where R, G, and B are all 5 bits integers (between 0 and 31) 
 * @returns {Object} The .stl file content as a String if binary option is false or as Buffer/ArraBuffer (depending on platform) if true
 */
const exportSTL = (...params) => {
    let [options] = params

    const defaultQrColor = [0, 0, 31]
    const defaultBaseColor = [0, 0, 0]
    const {
        cells,
        width = 7,
        bitSize = 2,
        height = 2,
        binary = true,
        baseColor = defaultBaseColor,
        margin = 2,
        qrColor = defaultQrColor,
        handle = null,
        stlOptions = {}
    } = options

    const colors = {
        qr: Array.isArray(qrColor) && qrColor.length === 3 ? qrColor : defaultQrColor,
        base: Array.isArray(baseColor) && baseColor.length === 3 ? baseColor : defaultBaseColor
    }

    //   const matrix = []
    //   for (let i = 0; i < codeSize; ++i) {
    //     let idx = i * codeSize
    //     let line = codeContent.slice(idx, idx + codeSize)
    //     matrix.push(line.split('').map(l => parseInt(l, 10)))
    //   }

    // create base
    const facets = [];

    //   if (handle && handle.facets && Array.isArray(handle.facets)) {
    //     facets.push(...handle.facets.map(f => ({...f, color: colors.base})))
    //   }


    // create 3d qrcode
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < width; y++) {
            for (let z = 0; z < width; z++) {
                const i = x+y*width+z*width*width;
                let cubeOptions = {
                    origins: [margin + x * bitSize, margin + y * bitSize, margin + z * bitSize],
                    size: bitSize,
                    height: height
                }
                if (cells[i] === 1) {
                    cubeOptions.color = colors.qrb
                    cubeOptions.walls = {
                        bottom: true,
                        back: true,//j === 0 || matrix[i][j - 1] === 0,
                        front: true,//j === codeSize - 1 || matrix[i][j + 1] === 0,
                        left: true,//i === 0 || matrix[i - 1][j] === 0,
                        right: true//i === codeSize - 1 || matrix[i + 1][j] === 0
                    }
                    facets.push(...createCube(cubeOptions))
                }
            }
        }
    }
    return stereol.exportStl(facets, {
            description: 'Cellular NFT - Iteration x ',
            binary,
            ...stlOptions
        })

}



export default exportSTL;

// const cells_flat = [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0];
// console.log(exportSTL({ cells: cells_flat, binary:false }));