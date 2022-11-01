import "the-new-css-reset/css/reset.css";
import "../styles/style.css";

import { OrbitControls } from "three/addons/controls/OrbitControls";
import {
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    Group,
    AmbientLight,
    DirectionalLight,
    PointLight,
} from "three";
import { GUI } from "dat.gui";

import { System } from "./system";

const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new WebGLRenderer({ alpha: true });
const gui = new GUI();
const scene = new Scene();
const controls = new OrbitControls(camera, renderer.domElement);

const system = new System(1, 3, true, 5);

const windowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

const domSetup = () => {
    window.addEventListener("resize", windowResize, false);
    windowResize();

    document.body.insertAdjacentElement("afterbegin", renderer.domElement);
    document.body.insertAdjacentElement("afterbegin", gui.domElement);
};

const placeLights = () => {
    const lightGroup = new Group();
    scene.add(lightGroup);

    const ambientLight = new AmbientLight(0x2e386b, 0.5);
    const directionalLight = new DirectionalLight(0xffffff, 0.5);
    const pointLight = new PointLight(0xffdd88, 1);

    directionalLight.position.set(-2, 2, 1);

    lightGroup.add(ambientLight);
    lightGroup.add(directionalLight);
    lightGroup.add(pointLight);
};

const placeCamera = () => {
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    controls.minDistance = 10;
    controls.maxDistance = 250;
};

const render = (delta) => {
    system.update(delta);
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

const updateSystem = (property, value) => {
    system[property] = value;

    scene.remove(system.group);
    system.construct();
    scene.add(system.group);

};

const start = () => {
    domSetup();
    placeLights();
    placeCamera();

    gui.add(system, "seed", 1, 100)
        .name("Random seed")
        .onChange((v) => updateSystem("seed", v));

    gui.add(system, "size", 1, 6, 1)
        .name("System size")
        .onChange((v) => updateSystem("size", v));

    gui.add(system, "animation", 1, 100, 1)
        .name("Animation speed")
        .onChange((v) => updateSystem("animation", v));

    gui.add(system, "orbits")
        .name("Orbit display")
        .onChange((v) => updateSystem("orbits", v));

    scene.add(system.group);

    render();
};

start();
