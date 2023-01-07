function random(min,max){
 return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDimCoordinate(){
    return random(-BOUNDARIES + 3 , BOUNDARIES -3);
}


function randomDimDeltaCoordinate(min,max,currentpositiom)
{
    var continueLoop = true;
    var ReturnValue = 0;

    do 
    {
        var delta = random(min,max);
        var candidatePosition = currentpositiom + delta;
        if( (-BOUNDARIES + 3 < candidatePosition) && ( candidatePosition < BOUNDARIES -3))
        {   
            ReturnValue = candidatePosition;
            continueLoop = false;
        }

    } 
    while (continueLoop == true);
      
    return ReturnValue;
}

function randomDeltaCoordinate(xposition,yposition)
{
    var X = randomDimDeltaCoordinate(0,speed,xposition);
    var Y = 0;
    var Z = randomDimDeltaCoordinate(0,speed,yposition);
    return [X,Y,Z]
}


function randomPosition()
{
    var X = randomDimCoordinate();
    var Y = 0;
    var Z = randomDimCoordinate();
    return [X,Y,Z]
}


function addCubePosition(num)
{
    var localCubePositions = [];
    for(let i = 0; i< num ; i++)
    {
        var nextCube = randomPosition();
        localCubePositions.push(nextCube);
    }

    return localCubePositions;
}

function addCubeColor(num)
{
    var localCubeColors = [];
    for(let i = 0; i< num ; i++)
    {
        localCubeColors.push(ColorWHITE);
    }

    return localCubeColors;
}

function addCubeCollision(num)
{
    var local = [];
    for(let i = 0; i< num ; i++)
    {
        local.push(false);
    }

    return local;
}

function startplaycube(num)
{
    cubePositions = [];
    cubeColors = [];
    cubeCollision = [];

    cubePositions = addCubePosition(num);
    cubeColors = addCubeColor(num);
    cubeCollision = addCubeCollision(num);
}

function startplay1cube(){
    startplaycube(1);
}

function startplay2cube(){
    startplaycube(2);
}

function startplay3cube(){
    startplaycube(3);
}

function powerleft(){
    console.log("powerleft");
    ArrowRotation = ArrowRotation + 5;
}



function powerright(){
    console.log("powerright");
    ArrowRotation = ArrowRotation - 5;
}


function startsphere(){
    console.log("startsphere");
    
    console.log("ArrowRotation : " + ArrowRotation);
    var rad = degToRad(ArrowRotation);
    var XDir = -Math.cos(rad);
    var YDir = -Math.sin(rad);
    console.log("XDir : " + XDir + ", YDir : " + YDir);
    sphereDirection = [ XDir , 0 , YDir];
    GameState = 1;
    speed = RUNNINGSPEED;
    startgame = new Date().getTime();
}

function initgame()
{
    ArrowRotation = 0;
    numberOfCube=0;
    cubePositions = [];
    cubeColors = [];
    cubeCollision = [];
    GameState = 0;  // 0 Init
    speed = IDLESPEED;
    sphereCurrentPosition = SphereInitPosition;
}

function startplayspecialcube()
{
    startplaycube(SPECIALCUBEINDEX + 1);
}

function countdown(){
    if(speed == RUNNINGSPEED)
    {
        speed = IDLESPEED;
    }
    else
    {
        speed = RUNNINGSPEED;
    }
}

function frustumonclick(){
    console.log("button_frustum.onclick");
    toggle_frustum_on_off = !toggle_frustum_on_off;
}