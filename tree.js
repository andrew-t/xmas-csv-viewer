import * as THREE from './three.js/three.module.js';

const camera = new THREE.PerspectiveCamera(
		70,
		window.innerWidth / window.innerHeight,
		0.01, 10
	);
camera.position.z = 1;

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const sprite = textureLoader.load('light.png');

let trimLights = 0.15;

function csvRows(t) {
	return t.split('\n')
		.map(r => r.trim())
		.filter(r => /^[-\d.,]+$/.test(r))
		.map(r => r.split(',').map(v => parseFloat(v.trim())));
}

function chunk(r, n) {
	const out = [];
	for (let i = 0; i <= r.length - n; i += n)
		out.push(r.slice(i, i + n));
	return out;
}

let coords = [], range = [1,1,1];

const lights = Array.from({length:500}).map(() => {
	const pos = new THREE.Vector3();
	const geo = new THREE.BufferGeometry();
	geo.setAttribute('position', new THREE.Float32BufferAttribute([0,0,0], 3));
	const mat = new THREE.PointsMaterial({
		size: 0.1,
		map: sprite,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true
	});
	const particles = new THREE.Points(geo, mat);
	return { pos, geo, mat, particles };
});

export async function setTree(coordsText) {
	if (coordsText.length < 500) {
		const coordsResponse = await fetch(coordsText);
		coordsText = await coordsResponse.text();
	}
	coords = csvRows(coordsText)
		.map(r => r.slice(r.length - 3));
	for (let i = 0; i < 3; ++i)
		range[i] = Math.max(...coords.map(c => Math.abs(c[i])));
	let lastLight;
	for (let i = 0; i < coords.length; ++i) {
		const l = lights[i];
		const c = coords[i];
		l.pos = new THREE.Vector3(...c);
		l.geo.setAttribute('position', new THREE.Float32BufferAttribute(c, 3));
		l.show = !lastLight || l.pos.distanceTo(lastLight) >= trimLights;
		if (l.show) {
			lastLight = l.pos;
			scene.add(l.particles);
		}
		else scene.remove(l.particles);
	}
}

let frame = 0, effect = [];

export async function setEffect(effectText) {
	if (effectText.length < 1000) {
		const effectResponse = await fetch(effectText);
		effectText = await effectResponse.text();
	}
	effect = csvRows(effectText)
		.map(r => r.slice(r.length - coords.length * 3))
		.map(x => x.map(x => x * 0.8 + 0.2*255)) // add dim bulbs for off so you can see the tree shape
		.map(x => x.map(x => x / 255))
		.map(r => chunk(r, 3));
	frame = 0;
}

export function go() {
	try {
		init();
	} catch (e) {
		console.error(e);
		alert(e.message);
	}
}

let sixty = true, spin = true;
export function setSixty(v) { sixty = v; }
export function setSpin(v) { spin = v }

function init() {

	for (const light of lights) if (light.show) scene.add(light.particles);

	const renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	document.body.appendChild( renderer.domElement );

	let rotationFrame = 0, skip = false;
	const startTheta = Math.random() * Math.PI * 2;
	setInterval(() => {
		const t = spin ? ++rotationFrame / 200 + startTheta : 0;
		camera.position.x = 3 * Math.sin(t);
		camera.position.y = 3 * Math.cos(t);
		camera.position.z = range[2] / 2;
		camera.rotation.x = Math.PI / 2;
		camera.rotation.y = Math.PI - t;
		renderer.render(scene, camera);

		if (!sixty) if (skip = !skip) return;

		const row = effect[frame];
		frame = (frame + 1) % effect.length;

		for (let i = 0; i < lights.length; ++i)
			if (lights[i].show)
				lights[i].mat.color.setRGB(...row[i]);
	}, 1000 / 60);
}
