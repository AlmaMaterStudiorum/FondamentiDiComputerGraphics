"use strict";
// CONST used in the application to make code easier

const OBJ_DIR = 'data/';
const TEXTURE_DIR = 'data/textures/'

// PATHS .OBJ FILES

const PATH_ARROW = OBJ_DIR + 'Arrow.obj';

// ARRAY INDICES FOR GEOMETRIES

const PLANE = 0;
const FRUSTUM = 1;
const G_ARROW = 2;
const G_SPECIALCUBE = 3;

// PATHS TEXTURES FILES

const PATH_ME = TEXTURE_DIR + 'me.jpg';

const PATH_WOOD = TEXTURE_DIR + 'wood.jpg';
const PATH_WOOD_PLANE = TEXTURE_DIR + 'plane.jpg';
const PATH_SPECIAL_CUBE = TEXTURE_DIR + 'special_cube.jpg';

// ARRAY INDICES FOR TEXTURES

const T_PLANE = 0;
const T_ARROW = 1;
const T_SPECIALCUBE = 2;

const SPECIALCUBEINDEX = 3;

const BOUNDARIES = 15;

const Xdim = 0;
const Ydim = 1;
const Zdim = 2;

const SphereInitPosition = [14,0,0];
const RUNNINGSPEED = 0.05;
const IDLESPEED = 0;

const ColorGREEN  =  [0,1,0,1];
const ColorWHITE  =  [1,1,1,1];
const ColorYELLOW =  [1,1,0,1];
const ColorRED    =  [1,0,0,1];

const depthTextureSize = 512;
