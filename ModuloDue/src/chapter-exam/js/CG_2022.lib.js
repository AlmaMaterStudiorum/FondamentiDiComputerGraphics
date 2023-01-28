function CreateCube()
{
  var cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
  var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff});
  var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubeMesh.castShadow = true;

  cubeMesh.position.x = 0;
  cubeMesh.position.y = 0;
  cubeMesh.position.z = -50;

  return cubeMesh;

}

function CreateCylinder()
{
  var cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 32 );
  var cylinderMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
  var cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinderMesh.castShadow = true;

  cylinderMesh.position.x = 0;
  cylinderMesh.position.y = 0;
  cylinderMesh.position.z = 50;

  return cylinderMesh;
}

function initPlane(scene)
{

    var groundPlane = addLargeGroundPlane(scene, true)
    groundPlane.position.y = -8;
    groundPlane.receiveShadow = true;
    
    return {groundPlane : groundPlane };
}