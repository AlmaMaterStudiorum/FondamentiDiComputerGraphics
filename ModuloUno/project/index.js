"use strict";

function HitTheCubeGame() {

    // Retrieve HTML elements for the interaction
    const canvas = document.getElementById('cube-canvas');
    canvas.width = screen.width * 0.8;
    canvas.height = screen.height * 0.7;
    const gl = canvas.getContext("webgl");

    // Checking if WebGL is supported
    if (!gl) {
        console.log("WebGL not supported, trying experimental-webgl..");
        gl = canvas.getContext('experimental-webgl'); // for broswer like safari / edge / ie
    };
    if (!gl) {
        alert('Your broswer does not support WebGL!');
    };

    // With a depth texture we can attach it to a framebuffer and then later use the texture as input to a shader
    const ext = gl.getExtension('WEBGL_depth_texture');

    // Checking if WEBGL_depth_texture is supported
    if (!ext) {
        return alert('Your broswer does not support WEBGL_depth_texture');
    }

    // Define a simple GUI using resources/dat.gui.js with toggler to change environment settings
    define_gui();
    // Used to apply transformation to scene objects -> outside loop prevent memory usage
    var mo_matrix = m4.identity();

    



    var sphereInit = true;
    //var sphereMatrix;
    
    sphereCurrentPosition = SphereInitPosition;
    //var sphereCurrentRotation = [0,0,0];
    //var sphereCurrentRotationUnique =0;
    var totalDeltaPosition = 0;


    function CreateCheckBoardTexture()
    {
        const checkerboardTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, checkerboardTexture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,                // mip level
          gl.LUMINANCE,     // internal format
          8,                // width
          8,                // height
          0,                // border
          gl.LUMINANCE,     // format
          gl.UNSIGNED_BYTE, // type
          new Uint8Array([  // data
            0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
            0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
            0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
            0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
            0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
            0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
            0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
            0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
          ]));
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        return checkerboardTexture;
    }
    function CreateCheckBoardProceduralTexture(thetarad)
    {

        var array= [];
        const size = 128;
        const radiousrevolution =  (size/4);
        const radiuspoint = 10;
        for(let i = 0 ; i < size*size ; i++)
        {
            array.push(255);
            array.push(255);
            array.push(255);
            array.push(255);
        }
       
        var xc =Math.ceil(size/2 + radiousrevolution*Math.cos(thetarad));
        var yc =Math.ceil(size/2 + radiousrevolution*Math.sin(thetarad));

        for(let d = 0; d <= radiuspoint ; d++)
        {
            for(let phi = 0 ; phi < 360 ; phi++)
            {
                var xp = xc + Math.ceil(d*Math.cos(degToRad(phi)));
                var yp = yc + Math.ceil(d*Math.sin(degToRad(phi)));  
                var index = xp + size*yp;
                array[index*4 + 0]= 255;
                array[index*4 + 1]= 0;
                array[index*4 + 2]= 0;   
                //array[index*4 + 2]= 255;              
            }
        }


        const checkerboardTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, checkerboardTexture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,                // mip level
          gl.RGBA,     // internal format
          size,                // width
          size,                // height
          0,                // border
          gl.RGBA,     // format
          gl.UNSIGNED_BYTE, // type
          new Uint8Array(array));
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        return checkerboardTexture;
    }

    function drawSphere(programInfo,bufferInfo)
    {

        const checkerboardTexture = CreateCheckBoardTexture();
        var sphereMatrix;

        webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);


        if(sphereInit == true)
        {
            sphereMatrix = m4.copy(mo_matrix);
            sphereInit = false;
        }


        var RadiusSphere = 1;
        var HalfSideCube = 1;
        var NormalVector = []

        
        // test hit negative X
        if(sphereCurrentPosition[Xdim] - RadiusSphere < -BOUNDARIES )
        {
            console.log("hit negative X");
            NormalVector=[1,0,0];
            sphereDirection = reflect(sphereDirection,NormalVector) ;
        }

        // test hit positive X
        if(sphereCurrentPosition[Xdim] + RadiusSphere > BOUNDARIES )
        {
            console.log("hit positive X");
            NormalVector=[-1,0,0];
            sphereDirection = reflect(sphereDirection,NormalVector) ;
        }

        // test hit negative Z
        if(sphereCurrentPosition[Zdim] - RadiusSphere < -BOUNDARIES )
        {
            console.log("hit negative Z");
            NormalVector=[0,0,1];
            sphereDirection = reflect(sphereDirection,NormalVector) ;
        }

        // test hit positive X
        if(sphereCurrentPosition[Zdim] + RadiusSphere > BOUNDARIES )
        {
            console.log("hit positive Z");
            NormalVector=[0,0,-1];
            sphereDirection = reflect(sphereDirection,NormalVector) ;
        }

       
       

        if(GameState != 2 && GameState != 3)
        {
            var CollisionIndex = -1;
            for(let i = 0 ; i < cubePositions.length ; i++)
            {
                var cubeCurrentPosition = cubePositions[i];
    
                var distance = m4.distance(sphereCurrentPosition,cubeCurrentPosition);
    
                if(distance <= RadiusSphere + Math.sqrt( Math.pow(HalfSideCube, 2) + Math.pow(HalfSideCube, 2)))
                {
                    

                    if(Math.abs( sphereCurrentPosition[Xdim] - cubeCurrentPosition[Xdim] ) >= RadiusSphere + HalfSideCube)
                    {
                        // test hit negative X
                        if(sphereCurrentPosition[Xdim] + RadiusSphere + speed <= cubeCurrentPosition[Xdim] - HalfSideCube )
                        {
                            
                            NormalVector=[-1,0,0];
                            if(NormalVector[Xdim] * sphereDirection[Xdim] <= 0)
                            {
                                console.log("cube hit negative X : " + i);
                                sphereDirection = reflect(sphereDirection,NormalVector) ;
                                CollisionIndex = i;
                                break;
                            }

                        }

                        // test hit positive X
                        if(sphereCurrentPosition[Xdim] - RadiusSphere - speed  >= cubeCurrentPosition[Xdim] + HalfSideCube )
                        {
                            
                            NormalVector=[1,0,0];
                            if(NormalVector[Xdim] * sphereDirection[Xdim] <= 0)
                            {
                                console.log("cube hit positive X : " + i);
                                sphereDirection = reflect(sphereDirection,NormalVector) ;
                                CollisionIndex = i;
                                break;
                            }
                        }
                    }
                    else
                    {
                        // test hit negative Z
                        if(sphereCurrentPosition[Zdim] + RadiusSphere + speed <= cubeCurrentPosition[Zdim] - HalfSideCube )
                        {
                            console.log("cube hit negative Z : " + i);
                            NormalVector=[0,0,-1];
                            sphereDirection = reflect(sphereDirection,NormalVector) ;
                            CollisionIndex = i;
                            break;
                        }

                        // test hit positive X
                        if(sphereCurrentPosition[Zdim] - RadiusSphere - speed >= cubeCurrentPosition[Zdim] + HalfSideCube )
                        {
                            console.log("cube hit positive Z : " + i);
                            NormalVector=[0,0,1];
                            sphereDirection = reflect(sphereDirection,NormalVector) ;
                            CollisionIndex = i;
                            break;
                        }
                    }
                }
            }

            if(CollisionIndex >= 0)
            {
                console.log("CollisionIndex : " + CollisionIndex);
                cubeColors[CollisionIndex] = ColorGREEN;
                cubeCollision[CollisionIndex] = true;
    
                var Counter = 0;
                for(let iCollision = 0 ; iCollision < cubeCollision.length ; iCollision++)
                {
                    if(cubeCollision[iCollision] == true)
                    {
                        Counter++;
                    }
                }
    
                if(cubeCollision.length == Counter)
                {
                    console.log("cubeCollision.length == Counter");
                    GameState = 2;
                }
    
            }
        }

        var deltaX = sphereDirection[Xdim]*speed;
        var deltaY = sphereDirection[Ydim]*speed;
        var deltaZ = sphereDirection[Zdim]*speed;

        sphereCurrentPosition = [sphereCurrentPosition[0] + deltaX ,
                                 sphereCurrentPosition[1] + deltaY,
                                 sphereCurrentPosition[2] + deltaZ];


        sphereMatrix = m4.translation(sphereCurrentPosition[0], 
                                      sphereCurrentPosition[1], 
                                      sphereCurrentPosition[2]);

        document.getElementById("xposition").innerHTML  = ToDigit( sphereCurrentPosition[Xdim]  ,3);   
        document.getElementById("zposition").innerHTML  = ToDigit( sphereCurrentPosition[Zdim]  ,3);           
        document.getElementById("xdirection").innerHTML = ToDigit( sphereDirection[Xdim]        ,3);   
        document.getElementById("zdirection").innerHTML = ToDigit( sphereDirection[Zdim]        ,3); 
        document.getElementById("arrowangle").innerHTML = ArrowRotation; 


        var deltaPosition = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2) + Math.pow(deltaZ, 2));
        totalDeltaPosition = totalDeltaPosition + deltaPosition;

       
        var sphereCurrentRotationUnique = 360*(totalDeltaPosition)/(2*Math.PI);

        var axisRotation = [sphereDirection[2],sphereDirection[1],-sphereDirection[0]];
        sphereMatrix = m4.axisRotate(sphereMatrix,axisRotation,degToRad(sphereCurrentRotationUnique));

        var sphereColor = ColorWHITE;
        if(GameState == 0)
        {
            sphereColor = ColorWHITE; // White
        }
        else if(GameState == 1)
        {
            sphereColor = ColorYELLOW; // Yellow
        }
        else if(GameState == 2)
        {
            sphereColor = ColorGREEN; // Green
        }
        else if(GameState == 3)
        {
            sphereColor = ColorRED; // Red
        }


        webglUtils.setUniforms(programInfo, {
            u_colorMult:sphereColor,
            u_world: sphereMatrix,
            u_texture: checkerboardTexture,
        });
        webglUtils.drawBufferInfo(gl, bufferInfo);
    }

    function drawCubes(programInfo,index)
    {

        var checkerboardTexture = CreateCheckBoardTexture();
        var position = cubePositions[index];
        var color = cubeColors[index];
        if(GameState != 2 && GameState != 3)
        {
            var distance = m4.distance(sphereCurrentPosition,position);

            if(distance <= 3)
            {               
                checkerboardTexture = CreateCheckBoardProceduralTexture(totalDeltaPosition);        
                color = ColorWHITE;       
            }
        }

        const cubeUniforms = {
            u_colorMult: [color[0],color[1],color[2],color[3]],
            u_texture: checkerboardTexture,
            u_world: m4.translation(position[0], position[1], position[2]),         
            
          };

        // Setup all the needed attributes.
        webglUtils.setBuffersAndAttributes(gl, programInfo, cubeBufferInfo);

        // Set the uniforms unique to the cube
        webglUtils.setUniforms(programInfo, cubeUniforms);

        // calls gl.drawArrays or gl.drawElements
        webglUtils.drawBufferInfo(gl, cubeBufferInfo);
    
    }

    function drawSpecialCube(programInfo,position,color)
    {
        
        var matrix = m4.translation(position[0], position[1], position[2]);
        matrix = m4.scale(matrix,2,2,2);

        const cubeUniforms = {
            //u_colorMult: [0.5, 1, 0.5, 1],  // lightgreen
            //u_colorMult: [color[0],color[1],color[2],color[3]],
            //u_color: [0, 0, 1, 1],
            u_colorMult: [color[0],color[1],color[2],color[3]],
            u_texture: textures[T_SPECIALCUBE],
            u_world: matrix,
          };

        // Setup all the needed attributes.
        webglUtils.setBuffersAndAttributes(gl, programInfo, specialCubeBufferInfo);

        // Set the uniforms unique to the cube
        webglUtils.setUniforms(programInfo, cubeUniforms);

        // calls gl.drawArrays or gl.drawElements
        webglUtils.drawBufferInfo(gl, specialCubeBufferInfo);  
    }

   

    function drawArrow(programInfo) {
        webglUtils.setBuffersAndAttributes(gl, programInfo, arrowBufferInfo);
        var matrix = m4.translation(15, 0, 0);
        matrix = m4.zRotate(matrix,degToRad(90));
        matrix = m4.xRotate(matrix,degToRad(-ArrowRotation));

        webglUtils.setUniforms(programInfo, {
            u_colorMult: [0.9, 0.8, 1, 1],
            u_color: [1, 0, 0, 1],
            u_texture: textures[T_ARROW],
            u_world: matrix,
        });
        webglUtils.drawBufferInfo(gl, arrowBufferInfo);
    }

    function drawPlane(programInfo) {
        webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo_plane);
        webglUtils.setUniforms(programInfo, {
            u_colorMult: [0.9, 0.8, 1, 1],
            u_color: [1, 0, 0, 1],
            u_texture: textures[T_PLANE],
            u_world: m4.translation(0, -1.5, 0),
            
        });
        webglUtils.drawBufferInfo(gl, bufferInfo_plane);
    }

    
    
    function drawFrustum(cameraMatrix, colorProgramInfo, lightWorldMatrix, lightProjectionMatrix, projectionMatrix) {
        const viewMatrix = m4.inverse(cameraMatrix);
        gl.useProgram(colorProgramInfo.program);

        // Setup all the needed attributes.
        webglUtils.setBuffersAndAttributes(gl, colorProgramInfo, geometries[FRUSTUM]);

        // scale the cube in Z so it's really long to represent the texture is being projected toinfinity
        const mat = m4.multiply(lightWorldMatrix, m4.inverse(lightProjectionMatrix));

        webglUtils.setUniforms(colorProgramInfo, {
            u_color: [1, 1, 1, 1],
            u_view: viewMatrix,
            u_projection: projectionMatrix,
            u_world: mat,
      });
        webglUtils.drawBufferInfo(gl, geometries[FRUSTUM], gl.LINES);
    }

    // compiles and links the shaders, looks up attribute and uniform locations
    const textureProgramInfo = webglUtils.createProgramInfo(gl, ['vertex-shader', 'fragment-shader']);
    const colorProgramInfo = webglUtils.createProgramInfo(gl, ['color-vertex-shader', 'color-fragment-shader']);

    // load textures
    setTextures(gl);

    // setGeometries
    setGeometries(gl);

    // Because data is just named arrays like this
    // {
    //   position: [...],
    //   texcoord: [...],
    //   normal: [...],
    // }
    // and because those names match the attributes in our vertex shader we can pass it directly into `createBufferInfoFromArrays`
    
    // create a buffer for each array by calling
    // gl.createBuffer, gl.bindBuffer, gl.bufferData

    const sphereBufferInfo = webglUtils.createBufferInfoFromArrays(gl, createSphereVertices());
    const cubeBufferInfo = webglUtils.createBufferInfoFromArrays(gl, createCubeVertices());
    const arrowBufferInfo = webglUtils.createBufferInfoFromArrays(gl, geometries[G_ARROW]);

    const bufferInfo_plane = webglUtils.createBufferInfoFromArrays(gl, geometries[PLANE]);

    const specialCubeBufferInfo = webglUtils.createBufferInfoFromArrays(gl, geometries[G_SPECIALCUBE]);


    //function ManageDepth()
    //{

    const depthTextureSize = 512;
    function CreateDepth()
    {
        const depthTexture = gl.createTexture();
        
        gl.bindTexture(gl.TEXTURE_2D, depthTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,      // target
            0,                  // mip level
            gl.DEPTH_COMPONENT, // internal format
            depthTextureSize,   // width
            depthTextureSize,   // height
            0,                  // border
            gl.DEPTH_COMPONENT, // format
            gl.UNSIGNED_INT,    // type
            null);              // data
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
        const depthFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,       // target
            gl.DEPTH_ATTACHMENT,  // attachment point
            gl.TEXTURE_2D,        // texture target
            depthTexture,         // texture
            0);                   // mip level


        // create a color texture of the same size as the depth texture
        const unusedTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, unusedTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            depthTextureSize,
            depthTextureSize,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
        // attach it to the framebuffer
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,        // target
            gl.COLOR_ATTACHMENT0,  // attachment point
            gl.TEXTURE_2D,         // texture target
            unusedTexture,         // texture
            0);                    // mip level

        return {texture:depthTexture , framebuffer : depthFramebuffer};
    }
            
    const depth = CreateDepth();
    
    //}
 
    

    // Variables introduced for camera movements
    var THETA = degToRad(38), PHI = degToRad(51);

    // Variables introduced for mouse and touch movements handling
    var drag, old_x, old_y, dX, dY;


    /*================= Mouse handler for canvas ======================*/
    canvas.addEventListener("mousedown", function(e) {
        drag = true;
        old_x = e.pageX
        old_y = e.pageY;
        e.preventDefault();
    }, false)

    canvas.addEventListener("mouseup", function(e) {
        drag = false;
    }, false)

    canvas.addEventListener("mousemove", function(e) {
        if (!drag) {
            return false; 
        }
        //dX = -(e.pageX - old_x) * 2 * Math.PI / canvas.width; 
        //dY = -(e.pageY - old_y) * 2 * Math.PI / canvas.height; 
        dX = (e.pageX - old_x)*2 / canvas.width; 
        dY = (e.pageY - old_y)*2 / canvas.height; 
        THETA += dX;
        PHI += dY;
        old_x = e.pageX;
        old_y = e.pageY; 
        e.preventDefault();
    }, false)

    /*================= Touch mobile handler for canvas ======================*/
    
    canvas.addEventListener("touchstart", function (e) {
        drag = true;
        old_x =  e.touches[0].clientX;
        old_y =  e.touches[0].clientY;
        e.preventDefault();  
    }, false);

    canvas.addEventListener("touchend", function (e) {
        drag = false;
    }, false);

    canvas.addEventListener("touchmove", function (e) {
        if (!drag) {
            return false; 
        }
        dX = -(e.touches[0].clientX - old_x) * 2 * Math.PI / canvas.width; 
        dY = -(e.touches[0].clientY - old_y) * 2 * Math.PI / canvas.height; 
        THETA += dX;
        PHI += dY;
        old_x = e.touches[0].clientX;
        old_y = e.touches[0].clientY;
        e.preventDefault();
    }, false);

    
    
    /*================= DRAWING ======================*/
    function drawScene(projectionMatrix, cameraMatrix, textureMatrix, lightWorldMatrix, programInfo) {
         // Make a view matrix from the camera matrix.
        const viewMatrix = m4.inverse(cameraMatrix);

        gl.useProgram(programInfo.program);
            
        webglUtils.setUniforms(programInfo, {
            u_view: viewMatrix,
            u_projection: projectionMatrix,
            u_bias: settings.bias,
            u_textureMatrix: textureMatrix,
            //u_projectedTexture:depth.depthTexture,
            u_shadowintensity : settings.shadowintensity / 100,
            u_projectedTexture:depth.texture,
            u_reverseLightDirection: lightWorldMatrix.slice(8, 11),
        });

        

        if(speed > 0)
        {   
            // Find the distance between now and the count down date
            var now = new Date().getTime();;
            var distance =  startgame - now;
        
            // Time calculations for days, hours, minutes and seconds

            var seconds = Math.floor(settings.countdown + (distance % (1000 * 60)) / 1000);

            if(seconds <= 0)
            {
                GameState = 3;
            }
                
            // Output the result in an element with id="demo"
            document.getElementById("id_countdown").innerHTML =  seconds + "s ";
        }
       
        //drawBox(programInfo);
        drawPlane(programInfo);
        for(let i = 0; i < cubePositions.length ; i++)
        {

            var cp = cubePositions[i];
            var cc = cubeColors[i];
            if(i != SPECIALCUBEINDEX)
            {
                drawCubes(programInfo,i);
            }
            else
            {
                var rad = degToRad(totalDeltaPosition);
                cp = [cp[Xdim] + 2*Math.cos(10*rad),cp[Ydim],cp[Zdim] + 2*Math.sin(10*rad)]
                drawSpecialCube(programInfo,cp,cc)
            }
            
        }
        
        
        drawSphere(programInfo,sphereBufferInfo);
        drawArrow(programInfo);

        if(GameState == 2 || GameState == 3)
        {
            speed = 0;
        }
       
    }

    // Draw the scene.
    function render() {
        //gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // first draw from the POV of the light
        const lightWorldMatrix = m4.lookAt(
            [settings.posX, settings.posY, settings.posZ],          // position
            [settings.targetX, settings.targetY, settings.targetZ], // target
            settings.up,                                              // up
        );
        
        const lightProjectionMatrix = m4.perspective(
                degToRad(settings.fieldOfView),
                settings.projWidth / settings.projHeight,
                settings.zNear,  // near
                settings.zFar)   // far
           
        // draw to the depth texture
        gl.bindFramebuffer(gl.FRAMEBUFFER, depth.framebuffer);
        gl.viewport(0, 0, depthTextureSize, depthTextureSize);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if(true) {
            //console.log("toggle_shadow_on_off : " + toggle_shadow_on_off)
            drawScene(lightProjectionMatrix, lightWorldMatrix, m4.identity(), lightWorldMatrix, colorProgramInfo);
        }
        // now draw scene to the canvas projecting the depth texture into the scene
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor( 61/255, 119/255, 255/255, 1.0); // same color of the html body
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let textureMatrix = m4.identity();
        var translate = 0.5;
        var scale = 0.5;
        textureMatrix = m4.translate(textureMatrix, translate, translate, translate);
        textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
        // lightProjectionMatrix : Frustum luce di proiezione , punto di vista della luce
        textureMatrix = m4.multiply(textureMatrix, lightProjectionMatrix);
        // lightWorldMatrix : vettore del punto luce
        textureMatrix = m4.multiply(textureMatrix, m4.inverse(lightWorldMatrix));

        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const projectionMatrix = m4.perspective(degToRad(settings.fieldOfView), aspect, settings.zNear, settings.zFar);

        var camera = [settings.D*Math.sin(PHI)*Math.cos(THETA), settings.D*Math.sin(PHI)*Math.sin(THETA), settings.D*Math.cos(PHI)];
        const cameraMatrix = m4.lookAt(camera, settings.target, settings.up);

        drawScene(projectionMatrix, cameraMatrix, textureMatrix, lightWorldMatrix, textureProgramInfo);
        if(toggle_frustum_on_off) {
            drawFrustum(cameraMatrix, colorProgramInfo, lightWorldMatrix, lightProjectionMatrix, projectionMatrix);
        }
        requestAnimationFrame(render);
    }

    const times = [];
    let fps;
    var div = document.getElementById('fps_counter');

    function refreshLoop() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
        }
        times.push(now);
        fps = times.length;
        //console.log(fps);
        refreshLoop();
        if(settings.show_fps) {
            div.innerHTML = 'FPS: ' + fps;
        } else {
            div.innerHTML = '';
        }
    });}

    refreshLoop();
    requestAnimationFrame(render);  
}

