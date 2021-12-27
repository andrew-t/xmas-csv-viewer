import * as THREE from './three.js/three.module.js';

let camera, scene, renderer;

const coordsFile = 'coords/harvard.csv',
	effectFile = 'effects/harvard/example-rainbow.csv';

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

async function go() {
	try {
		const coordsResponse = await fetch(coordsFile),
			coordsText = await coordsResponse.text(),
			coords = csvRows(coordsText)
				.map(r => r.slice(r.length - 3));
		const effectResponse = await fetch(effectFile),
			effectText = await effectResponse.text(),
			effect = csvRows(effectText)
				.map(r => r.slice(r.length - coords.length * 3))
				.map(x => x.map(x => x / 255))
				.map(r => chunk(r, 3));
		console.log({ coords, effect });
		init(coords, effect);
	} catch (e) {
		console.error(e);
		alert(e.message);
	}
}

go();

function init(coords, effect) {
	camera = new THREE.PerspectiveCamera(
		70,
		window.innerWidth / window.innerHeight,
		0.01, 10
	);
	camera.position.z = 1;

	scene = new THREE.Scene();

	const textureLoader = new THREE.TextureLoader();
	const sprite = textureLoader.load('light.png');

	const lights = coords.map(c => {
		const pos = new THREE.Vector3(...c);
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.Float32BufferAttribute(c, 3));
		const mat = new THREE.PointsMaterial({
			size: 0.1,
			map: sprite,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true
		});
		const particles = new THREE.Points(geo, mat);
		scene.add(particles);
		return { pos, mat, particles };
	});

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setAnimationLoop( animation(lights, effect) );
	document.body.appendChild( renderer.domElement );

}

function animation(lights, effect) {
	let f = 0;
	const startTheta = Math.random() * Math.PI * 2;
	return function animationInner(time) {
		const t = time / 2000 + startTheta;
		const row = effect[f];
		f = (f + 1) % effect.length;

		for (let i = 0; i < lights.length; ++i)
			lights[i].mat.color.setRGB(...effect[f][i]);

		camera.position.x = 3 * Math.sin(t);
		camera.position.y = 3 * Math.cos(t);
		camera.position.z = 1.4;
		camera.rotation.x = Math.PI / 2;
		camera.rotation.y = Math.PI - t;
		renderer.render(scene, camera);
	}
}
