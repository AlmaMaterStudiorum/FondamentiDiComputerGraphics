'use strict';
function createBufferInfoFunc(fn) {
    return function(gl) {
      const arrays = fn.apply(null,  Array.prototype.slice.call(arguments, 1));
      return webglUtils.createBufferInfoFromArrays(gl, arrays);
    };
  }
function createSphereVertices(){
    var radius =  1;
    var subdivisionsAxis = 32;
    var subdivisionsHeight = 24;
    var opt_startLatitudeInRadians,
        opt_endLatitudeInRadians,
        opt_startLongitudeInRadians,
        opt_endLongitudeInRadians;
    if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
      throw Error('subdivisionAxis and subdivisionHeight must be > 0');
    }

    opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
    opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
    opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
    opt_endLongitudeInRadians = opt_endLongitudeInRadians || (Math.PI * 2);

    const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
    const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

    // We are going to generate our sphere by iterating through its
    // spherical coordinates and generating 2 triangles for each quad on a
    // ring of the sphere.
    const numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
    const positions = webglUtils.createAugmentedTypedArray(3, numVertices);
    const normals   = webglUtils.createAugmentedTypedArray(3, numVertices);
    const texCoords = webglUtils.createAugmentedTypedArray(2 , numVertices);

    // Generate the individual vertices in our vertex buffer.
    for (let y = 0; y <= subdivisionsHeight; y++) {
      for (let x = 0; x <= subdivisionsAxis; x++) {
        // Generate a vertex based on its spherical coordinates
        const u = x / subdivisionsAxis;
        const v = y / subdivisionsHeight;
        const theta = longRange * u;
        const phi = latRange * v;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
        const ux = cosTheta * sinPhi;
        const uy = cosPhi;
        const uz = sinTheta * sinPhi;
        positions.push(radius * ux, radius * uy, radius * uz);
        normals.push(ux, uy, uz);
        texCoords.push(1 - u, v);
      }
    }

    const numVertsAround = subdivisionsAxis + 1;
    const indices = webglUtils.createAugmentedTypedArray(3, subdivisionsAxis * subdivisionsHeight * 2, Uint16Array);
    for (let x = 0; x < subdivisionsAxis; x++) {
      for (let y = 0; y < subdivisionsHeight; y++) {
        // Make triangle 1 of quad.
        indices.push(
            (y + 0) * numVertsAround + x,
            (y + 0) * numVertsAround + x + 1,
            (y + 1) * numVertsAround + x);

        // Make triangle 2 of quad.
        indices.push(
            (y + 1) * numVertsAround + x,
            (y + 0) * numVertsAround + x + 1,
            (y + 1) * numVertsAround + x + 1);
      }
    }

    return {
      position: positions,
      normal: normals,
      texcoord: texCoords,
      indices: indices,
    };
  }
function applyFuncToV3Array(array, matrix, fn) {
    const len = array.length;
    const tmp = new Float32Array(3);
    for (let ii = 0; ii < len; ii += 3) {
      fn(matrix, [array[ii], array[ii + 1], array[ii + 2]], tmp);
      array[ii    ] = tmp[0];
      array[ii + 1] = tmp[1];
      array[ii + 2] = tmp[2];
    }
  }
function transformNormal(mi, v, dst) {
    dst = dst || new Float32Array(3);
    const v0 = v[0];
    const v1 = v[1];
    const v2 = v[2];

    dst[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2];
    dst[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2];
    dst[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2];

    return dst;
  }
function reorientDirections(array, matrix) {
    applyFuncToV3Array(array, matrix, m4.transformDirection);
    return array;
  }
  /*
   * Reorients normals by the inverse-transpose of the given
   * matrix.
   */
function reorientNormals(array, matrix) {
    applyFuncToV3Array(array, m4.inverse(matrix), transformNormal);
    return array;
  }
  /*
   * Reorients positions by the given matrix. In other words, it
   * multiplies each vertex by the given matrix.
   */
function reorientPositions(array, matrix) {
    applyFuncToV3Array(array, matrix, m4.transformPoint);
    return array;
  }
  /*
   * Reorients arrays by the given matrix. Assumes arrays have
   * names that contains 'pos' could be reoriented as positions,
   * 'binorm' or 'tan' as directions, and 'norm' as normals.
   */
function reorientVertices(arrays, matrix) {
    Object.keys(arrays).forEach(function(name) {
      const array = arrays[name];
      if (name.indexOf('pos') >= 0) {
        reorientPositions(array, matrix);
      } else if (name.indexOf('tan') >= 0 || name.indexOf('binorm') >= 0) {
        reorientDirections(array, matrix);
      } else if (name.indexOf('norm') >= 0) {
        reorientNormals(array, matrix);
      }
    });
    return arrays;
  }
function createPlaneVertices(){
   var width = 40;
   var depth = 40;
   var subdivisionsWidth = 1;
   var subdivisionsDepth = 1;
   var matrix;

    width = width || 1;
    depth = depth || 1;
    subdivisionsWidth = subdivisionsWidth || 1;
    subdivisionsDepth = subdivisionsDepth || 1;
    matrix = matrix || m4.identity();

    const numVertices = (subdivisionsWidth + 1) * (subdivisionsDepth + 1);
    const positions = webglUtils.createAugmentedTypedArray(3, numVertices);
    const normals = webglUtils.createAugmentedTypedArray(3, numVertices);
    const texcoords = webglUtils.createAugmentedTypedArray(2, numVertices);

    for (let z = 0; z <= subdivisionsDepth; z++) {
      for (let x = 0; x <= subdivisionsWidth; x++) {
        const u = x / subdivisionsWidth;
        const v = z / subdivisionsDepth;
        positions.push(
            width * u - width * 0.5,
            0,
            depth * v - depth * 0.5);
        normals.push(0, 1, 0);
        texcoords.push(u, v);
      }
    }

    const numVertsAcross = subdivisionsWidth + 1;
    const indices = webglUtils.createAugmentedTypedArray(
        3, subdivisionsWidth * subdivisionsDepth * 2, Uint16Array);

    for (let z = 0; z < subdivisionsDepth; z++) {
      for (let x = 0; x < subdivisionsWidth; x++) {
        // Make triangle 1 of quad.
        indices.push(
            (z + 0) * numVertsAcross + x,
            (z + 1) * numVertsAcross + x,
            (z + 0) * numVertsAcross + x + 1);

        // Make triangle 2 of quad.
        indices.push(
            (z + 1) * numVertsAcross + x,
            (z + 1) * numVertsAcross + x + 1,
            (z + 0) * numVertsAcross + x + 1);
      }
    }

    const arrays = reorientVertices({
      position: positions,
      normal: normals,
      texcoord: texcoords,
      indices: indices,
    }, matrix);
    return arrays;
  }
function createCubeVertices() {
    const k = 1;
    const cornerVertices = [
      [-k, -k, -k],
      [+k, -k, -k],
      [-k, +k, -k],
      [+k, +k, -k],
      [-k, -k, +k],
      [+k, -k, +k],
      [-k, +k, +k],
      [+k, +k, +k],
    ];

    const faceNormals = [
      [+1, +0, +0],
      [-1, +0, +0],
      [+0, +1, +0],
      [+0, -1, +0],
      [+0, +0, +1],
      [+0, +0, -1],
    ];

    const uvCoords = [
      [1, 0],
      [0, 0],
      [0, 1],
      [1, 1],
    ];

    const numVertices = 6 * 4;
    const positions = webglUtils.createAugmentedTypedArray(3, numVertices);
    const normals   = webglUtils.createAugmentedTypedArray(3, numVertices);
    const texCoords = webglUtils.createAugmentedTypedArray(2 , numVertices);
    const indices   = webglUtils.createAugmentedTypedArray(3, 6 * 2, Uint16Array);

    for (let f = 0; f < 6; ++f) {
      const faceIndices = CUBE_FACE_INDICES[f];
      for (let v = 0; v < 4; ++v) {
        const position = cornerVertices[faceIndices[v]];
        const normal = faceNormals[f];
        const uv = uvCoords[v];

        // Each face needs all four vertices because the normals and texture
        // coordinates are not all the same.
        positions.push(position);
        normals.push(normal);
        texCoords.push(uv);

      }
      // Two triangles make a square face.
      const offset = 4 * f;
      indices.push(offset + 0, offset + 1, offset + 2);
      indices.push(offset + 0, offset + 2, offset + 3);
    }

    return {
      position: positions,
      normal: normals,
      texcoord: texCoords,
      indices: indices,
    };
  }

  const CUBE_FACE_INDICES = [
    [3, 7, 5, 1], // right
    [6, 2, 0, 4], // left
    [6, 7, 3, 2], // ??
    [0, 1, 5, 4], // ??
    [7, 6, 4, 5], // front
    [2, 3, 1, 0], // back
  ];