

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }
    switch (event.key) {
        case "1": // mode 1
            console.log('1');
            startplay1cube();
        break;
        case "2": // mode 2
            console.log('2');
            startplay2cube();
        break;
        case "3": // mode 3
            console.log('3');
            startplay3cube();
        break;
        case "4": // mode special
            console.log('4');
            startplayspecialcube();
        break;
        case "i": // left
            console.log('i');
            initgame();
        break;
        case "a": // left
            console.log('a');
            powerleft();
        break;
        case "s": // start
            console.log('s');
            startsphere();
        break;
        case "d": // right
            console.log('d');
            powerright();
        break;
        case "f": // f -> frustum
            console.log('f');
            toggle_frustum_on_off = !toggle_frustum_on_off;
            break;

        default:
            return; // Quit when this doesn't handle the key event.
    }
    event.preventDefault(); // Cancel the default action to avoid it being handled twice
}, true);


function define_gui() {
    var gui = new dat.GUI();
    
    gui.add(settings,"D").min(5).max(60).step(0.5);
    gui.add(settings,"posX").min(0).max(10).step(0.5);
    gui.add(settings,"posY").min(0).max(20).step(0.5);
    gui.add(settings,"posZ").min(0).max(10).step(0.5);
    gui.add(settings,"targetX").min(0).max(5).step(0.5);
    gui.add(settings,"targetY").min(-1).max(5).step(0.5);
    gui.add(settings,"targetZ").min(0).max(5).step(0.5);
    gui.add(settings,"projWidth").min(0).max(5).step(0.5);
    gui.add(settings,"projHeight").min(0).max(5).step(0.5);
    //gui.add(settings,"bias").min(-0.010).max(0.010).step(0.001);
    gui.add(settings,"fieldOfViewLight").min(60).max(120).step(5);
    gui.add(settings,"fieldOfViewObserver").min(60).max(120).step(5);
    //gui.add(settings,"dx").min(0.001).max(0.030).step(0.001);
    //gui.add(settings,"de").min(0.01).max(0.05).step(0.001);
    gui.add(settings,"countdown").min(5).max(120).step(1);
    //gui.add(settings, "show_fps");
    gui.add(settings, "shadowintensity").min(0).max(100).step(1);
    gui.add(settings, "shadowingcoefficentfrustum").min(0).max(100).step(1);
    gui.add(settings, "shadowingcoefficentnofrustum").min(0).max(100).step(1);
    gui.close();
}


