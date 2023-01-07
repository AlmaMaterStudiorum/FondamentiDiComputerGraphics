"use strict";
// CONST used in the application to make code easier

const OBJ_DIR = 'data/';
const TEXTURE_DIR = 'data/textures/'

// PATHS .OBJ FILES
const PATH_BACK = OBJ_DIR + 'back.obj';
const PATH_BODY = OBJ_DIR + 'body.obj';
const PATH_LACES = OBJ_DIR + 'laces.obj';
const PATH_LEFT_LOGO = OBJ_DIR + 'left_logo.obj';
const PATH_RIGHT_LOGO = OBJ_DIR + 'right_logo.obj';
const PATH_SOLE = OBJ_DIR + 'sole.obj';
const PATH_TOUNG = OBJ_DIR + 'toung.obj';
const PATH_LATERAL_MESH = OBJ_DIR + 'lateral_cover.obj';
const PATH_TOE_MESH = OBJ_DIR + 'toe_cover.obj';
const PATH_SIDE_MESH = OBJ_DIR + 'side_cover.obj';
const PATH_ARROW = OBJ_DIR + 'Arrow.obj';

// ARRAY INDICES FOR GEOMETRIES
/*
const BODY = 0;
const LACES = 1;
const TOUNG = 2;
const LATERAL_MESH = 3;
const TOE_MESH = 4;
const SIDE_MESH = 5;
const SOLE = 6;
const LEFT_LOGO = 7;
const RIGHT_LOGO = 8;
const BACK = 9;
*/
const PLANE = 0;
const FRUSTUM = 1;
const G_ARROW = 2;
const G_SPECIALCUBE = 3;

// PATHS TEXTURES FILES
/*
const PATH_BLACK_LEATHER = TEXTURE_DIR + 'black_leather.jpg';
const PATH_BLUE_LEATHER = TEXTURE_DIR + 'blue_leather.jpg';
const PATH_WHITE_LEATHER = TEXTURE_DIR + 'white_leather.jpg';
const PATH_ORANGE_LEATHER = TEXTURE_DIR + 'orange_leather.jpg';
const PATH_RED_LEATHER = TEXTURE_DIR + 'red_leather.jpg';
const PATH_LACES_MESH = TEXTURE_DIR + 'laces_mesh.jpg';
const PATH_SOLE_RUBBER = TEXTURE_DIR + 'sole_rubber.jpg';
const PATH_MARBLE = TEXTURE_DIR + 'marble.jpg';
*/
const PATH_ME = TEXTURE_DIR + 'me.jpg';

const PATH_WOOD = TEXTURE_DIR + 'wood.jpg';
const PATH_WOOD_PLANE = TEXTURE_DIR + 'plane.jpg';
const PATH_SPECIAL_CUBE = TEXTURE_DIR + 'special_cube.jpg';

// ARRAY INDICES FOR TEXTURES
/*
const BLACK_LEATHER  = 0;
const BLUE_LEATHER = 1;
const ORANGE_LEATHER = 2;
const RED_LEATHER = 3;
const WHITE_LEATHER = 4;
const SOLE_RUBBER = 5;
const LACES_MESH = 6;
*/
const T_PLANE = 0;
const T_ME = 1;
const T_ARROW = 2;
const T_SPECIALCUBE = 3;

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
