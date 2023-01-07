var result; // used to temporary store loadDoc result as text
const geometries = []; // contains all the geometry of the .obj loaded
const textures = []; // contains all predefined textures

function setGeometries(gl) {

    function loadDoc(url) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4) {
                result = xhttp.responseText;
           }
        };
        xhttp.open("GET", url, false);
        xhttp.send(null);
    }

    // PLANE
    {
		const S = 15; 		
		const H = 0.15; 

		const arrays_floor = {
		   position: 	{ numComponents: 3, data: [-S,H,-S, S,H,-S, -S,H,S,  S,H,S,], },
		   texcoord: 	{ numComponents: 2, data: [ 0,0, 1,0, 0,1, 1,1,] },
		   indices: 	{ numComponents: 3, data: [0,2,1, 	2,3,1,], },
		   normal:		{ numComponents: 3, data: [0,1,0,	0,1,0,	0,1,0,	0,1,0,], },
		};
        geometries.push(arrays_floor);
	}

    // FRUSTUM
    const cubeLinesBufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
        position: [
          -1, -1, -1,
           1, -1, -1,
          -1,  1, -1,
           1,  1, -1,
          -1, -1,  1,
           1, -1,  1,
          -1,  1,  1,
           1,  1,  1,
        ],
        indices: [
          0, 1,
          1, 3,
          3, 2,
          2, 0,
    
          4, 5,
          5, 7,
          7, 6,
          6, 4,
    
          0, 4,
          1, 5,
          3, 7,
          2, 6,
        ],
    });
    geometries.push(cubeLinesBufferInfo);

    // Arrow
    loadDoc(PATH_ARROW);
    geometries.push(parseOBJ(result));

    // Special Cube
    {
        var positions = 
            [
            -0.5, -0.5,  -0.5,
            -0.5,  0.5,  -0.5,
             0.5, -0.5,  -0.5,
            -0.5,  0.5,  -0.5,
             0.5,  0.5,  -0.5,
             0.5, -0.5,  -0.5,
        
            -0.5, -0.5,   0.5,
             0.5, -0.5,   0.5,
            -0.5,  0.5,   0.5,
            -0.5,  0.5,   0.5,
             0.5, -0.5,   0.5,
             0.5,  0.5,   0.5,
        
            -0.5,   0.5, -0.5,
            -0.5,   0.5,  0.5,
             0.5,   0.5, -0.5,
            -0.5,   0.5,  0.5,
             0.5,   0.5,  0.5,
             0.5,   0.5, -0.5,
        
            -0.5,  -0.5, -0.5,
             0.5,  -0.5, -0.5,
            -0.5,  -0.5,  0.5,
            -0.5,  -0.5,  0.5,
             0.5,  -0.5, -0.5,
             0.5,  -0.5,  0.5,
        
            -0.5,  -0.5, -0.5,
            -0.5,  -0.5,  0.5,
            -0.5,   0.5, -0.5,
            -0.5,  -0.5,  0.5,
            -0.5,   0.5,  0.5,
            -0.5,   0.5, -0.5,
        
             0.5,  -0.5, -0.5,
             0.5,   0.5, -0.5,
             0.5,  -0.5,  0.5,
             0.5,  -0.5,  0.5,
             0.5,   0.5, -0.5,
             0.5,   0.5,  0.5,
        
            ];

        var texcoord = 
                [
                // select the top left image
                0   , 0  ,
                0   , 0.5,
                0.25, 0  ,
                0   , 0.5,
                0.25, 0.5,
                0.25, 0  ,
                // select the top middle image
                0.25, 0  ,
                0.5 , 0  ,
                0.25, 0.5,
                0.25, 0.5,
                0.5 , 0  ,
                0.5 , 0.5,
                // select to top right image
                0.5 , 0  ,
                0.5 , 0.5,
                0.75, 0  ,
                0.5 , 0.5,
                0.75, 0.5,
                0.75, 0  ,
                // select the bottom left image
                0   , 0.5,
                0.25, 0.5,
                0   , 1  ,
                0   , 1  ,
                0.25, 0.5,
                0.25, 1  ,
                // select the bottom middle image
                0.25, 0.5,
                0.25, 1  ,
                0.5 , 0.5,
                0.25, 1  ,
                0.5 , 1  ,
                0.5 , 0.5,
                // select the bottom right image
                0.5 , 0.5,
                0.75, 0.5,
                0.5 , 1  ,
                0.5 , 1  ,
                0.75, 0.5,
                0.75, 1  ,
        
              ];
              var normals = 
                [
                   0, 0, -1,
                   0, 0, -1,
                   0, 0, -1,
                   0, 0, -1,
                   0, 0, -1,
                   0, 0, -1,
            
                   0, 0, 1,
                   0, 0, 1,
                   0, 0, 1,
                   0, 0, 1,
                   0, 0, 1,
                   0, 0, 1,
            
                   0, 1, 0,
                   0, 1, 0,
                   0, 1, 0,
                   0, 1, 0,
                   0, 1, 0,
                   0, 1, 0,
            
                   0, -1, 0,
                   0, -1, 0,
                   0, -1, 0,
                   0, -1, 0,
                   0, -1, 0,
                   0, -1, 0,
            
                  -1, 0, 0,
                  -1, 0, 0,
                  -1, 0, 0,
                  -1, 0, 0,
                  -1, 0, 0,
                  -1, 0, 0,
            
                   1, 0, 0,
                   1, 0, 0,
                   1, 0, 0,
                   1, 0, 0,
                   1, 0, 0,
                   1, 0, 0,
                ];

        const arrSpecialCube = {
            position: 	{ numComponents: 3, data: positions, },
            texcoord: 	{ numComponents: 2, data: texcoord },
            //indices: 	{ numComponents: 3, data: [0,2,1, 	2,3,1,], },
            normal:		{ numComponents: 3, data: normals }
        };
        geometries.push(arrSpecialCube);
    }


}

function setTextures(gl) {
    /*
    textures[0] = textureFromImage(gl, PATH_BLACK_LEATHER);
    textures[1] = textureFromImage(gl, PATH_BLUE_LEATHER);
    textures[2] = textureFromImage(gl, PATH_ORANGE_LEATHER);
    textures[3] = textureFromImage(gl, PATH_RED_LEATHER);
    textures[4] = textureFromImage(gl, PATH_WHITE_LEATHER);
    textures[5] = textureFromImage(gl, PATH_SOLE_RUBBER);
    textures[6] = textureFromImage(gl, PATH_LACES_MESH);
    */
    textures[T_PLANE] = textureFromImage(gl, PATH_WOOD_PLANE);
    textures[T_ME] = textureFromImage(gl, PATH_ME);
    textures[T_ARROW] = textureFromImage(gl, PATH_WOOD);
    textures[T_SPECIALCUBE] = textureFromImage(gl, PATH_SPECIAL_CUBE);
}


