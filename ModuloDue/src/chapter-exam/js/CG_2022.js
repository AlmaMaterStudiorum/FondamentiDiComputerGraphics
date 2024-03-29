

function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  var scene = new THREE.Scene();

  initPlane(scene);

  var mixer = new THREE.AnimationMixer();
  
  var frameMesh;
  var meshHorse;
  var phi = 0.0;


  //var textGeometry;
  var textMesh;

  initDefaultLighting(scene, new THREE.Vector3(-10, 30, 80));

  //scene.children[1].position.x = -20;
  var loader = new THREE.JSONLoader();
  loader.load('../../assets/models/horse/horse.json', function (geometry, mat) {
    geometry.computeVertexNormals();
    geometry.computeMorphNormals();

    var mat = new THREE.MeshLambertMaterial({ morphTargets: true, vertexColors: THREE.FaceColors });
    meshHorse = new THREE.Mesh(geometry, mat);
    meshHorse.scale.set(0.15, 0.15, 0.15);
    meshHorse.translateY(-10);
    meshHorse.translateX(10);
    meshHorse.castShadow = true;

    mixer = new THREE.AnimationMixer(meshHorse);
    // or create a custom clip from the set of morphtargets
    // var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'gallop', geometry.morphTargets, 30 );
    //animationClip = geometry.animations[0];
    var clipAction;
    clipAction = mixer.clipAction(geometry.animations[0]).play();

    clipAction.setLoop(THREE.LoopRepeat);
    scene.add(meshHorse)

    // enable the controls
    //enableControls()
  })



  var font_bitstream;
  var font_helvetiker_bold;
  var font_helvetiker_regular;

  var step = 0;
  var text1;
  var text2;

  var fontload1 = new THREE.FontLoader();
  fontload1.load('../../assets/fonts/bitstream_vera_sans_mono_roman.typeface.json', function (response) {
    controls.font = response;
    font_bitstream = response;
    controls.redraw();
    render();
  });

  var fontload2 = new THREE.FontLoader();
  fontload2.load('../../assets/fonts/helvetiker_bold.typeface.json', function (response) {
    font_helvetiker_bold = response;
  });

  var fontload3 = new THREE.FontLoader();
  fontload3.load('../../assets/fonts/helvetiker_regular.typeface.json', function (response) {
    font_helvetiker_regular = response;
  });

  var controls = new function () {

    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;

    this.size = 90;
    this.height = 90;
    this.bevelThickness = 2;
    this.bevelSize = 0.5;
    this.bevelEnabled = true;
    this.bevelSegments = 3;
    this.bevelEnabled = true;
    this.curveSegments = 12;
    this.steps = 1;
    this.fontName = "bitstream vera sans mono";
    this.speed = 10;

    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {

      switch (controls.fontName) {
        case 'bitstream vera sans mono':
          controls.font = font_bitstream
          break;
        case 'helvetiker':
          controls.font = font_helvetiker_regular
          break;
        case 'helvetiker bold':
          controls.font = font_helvetiker_bold
          break;
      }

    };
  };


  var gui = new dat.GUI();
  gui.add(controls, 'size', 0, 200).onChange(controls.redraw);
  gui.add(controls, 'height', 0, 200).onChange(controls.redraw);
  gui.add(controls, 'fontName', ['bitstream vera sans mono', 'helvetiker', 'helvetiker bold']).onChange(controls.redraw);
  gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'bevelSize', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.redraw);
  gui.add(controls, 'bevelEnabled').onChange(controls.redraw);
  gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.redraw);
  //gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.redraw);
  gui.add(controls, 'speed', 1, 100).step(1).onChange(controls.redraw);

  // add a material section, so we can switch between materials
  /*
  gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial,
    meshStandard: applyMeshStandardMaterial
  }).onChange(controls.redraw)

  gui.add(controls, 'castShadow').onChange(function (e) { controls.mesh.castShadow = e })
  gui.add(controls, 'groundPlaneVisible').onChange(function (e) { groundPlane.material.visible = e })
*/
  function CreateText() {
    var CurrentPhi = Math.floor(controls.speed * phi);
    if (lastPhi != CurrentPhi) {
      scene.remove(textMesh);
      var options = {
        font: controls.font,
        size: controls.size,
        height: controls.height,
        weight: controls.weight,
        font: controls.font,
        bevelThickness: controls.bevelThickness,
        bevelSize: controls.bevelSize,
        bevelSegments: controls.bevelSegments,
        bevelEnabled: controls.bevelEnabled,
        curveSegments: controls.curveSegments,
        steps: controls.steps
      };
      //console.log(CurrentPhi);
      var textGeometry = new THREE.TextGeometry(CurrentPhi.toString(), options)
      textGeometry.applyMatrix(new THREE.Matrix4().makeScale(0.05, 0.05, 0.05));
      textGeometry.center();
      var material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      textMesh = null;
      textMesh = new THREE.Mesh(textGeometry, material);
      scene.add(textMesh);
      lastPhi = CurrentPhi;
      //return textGeometry
    };
  }

  var cylinder = CreateCylinder()

  scene.add(cylinder);


  var cube = CreateCube()

  scene.add(cube)

  CreateText();


  function degToRad(deg) {
    return deg * Math.PI / 180;
  }
  render();

  function render() {
    stats.update();
    var delta = clock.getDelta();
    phi += delta;
    var rotationAngle = controls.speed * phi;
    if (rotationAngle >= 360) {
      phi = 0;
    }
    trackballControls.update(delta);

    CreateText();

    var hX = 100 * Math.cos(degToRad(rotationAngle));
    var hZ = 50 * Math.sin(degToRad(rotationAngle));
    const peakAngle = 270;
    const peakHeight = 25;
    var startRamp = 45;
    var hYoffset = -7.0;
    var hY = hYoffset;
    if (((peakAngle - startRamp) < rotationAngle) && (rotationAngle < (peakAngle + startRamp))) {
      if (rotationAngle <= peakAngle) {
        var x = rotationAngle;
        var x1 = (peakAngle - startRamp);
        var x2 = peakAngle;
        var y1 = hYoffset;
        var y2 = peakHeight;

        var y = ((x - x1) / (x2 - x1)) * (y2 - y1) + y1;

        hY = y;
      }
      if (rotationAngle > peakAngle) {
        var x = rotationAngle;
        var x1 = peakAngle;
        var x2 = (peakAngle + startRamp);
        var y1 = peakHeight;
        var y2 = hYoffset;

        var y = ((x - x1) / (x2 - x1)) * (y2 - y1) + y1;

        hY = y;
      }

    }

    meshHorse.rotation.y = -degToRad(controls.speed * phi);
    meshHorse.position.x = hX;
    meshHorse.position.y = hY;
    meshHorse.position.z = hZ;
    if (mixer /* && clipAction */) {
      mixer.update(delta);
      //controls.time = mixer.time;
      //controls.effectiveTimeScale = clipAction.getEffectiveTimeScale();
      //controls.effectiveWeight = clipAction.getEffectiveWeight();
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
