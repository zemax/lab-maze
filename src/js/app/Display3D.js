"use strict";

import {Settings} from "./Settings";
import {Grid} from "./Grid";

import hsl from "../helpers/hsl";

import {size} from "../helpers/viewport";

let scene;
let mesh;
let camera;

const renderer             = new THREE.WebGLRenderer( {
	alpha:     true,
	antialias: true
} );
renderer.shadowMap.enabled = true;

document.body.appendChild( renderer.domElement );

const resize = function () {
	let s = size();

	if ( !!renderer ) {
		renderer.setSize( s.width, s.height );
	}

	if ( !!camera ) {
		camera.aspect = s.width / s.height;
		camera.updateProjectionMatrix();
	}
};

window.addEventListener( 'resize', resize, false );

const Display = {
	init: function () {
		// Scene

		scene = new THREE.Scene();

		// Mesh

		mesh = new THREE.Object3D();
		scene.add( mesh );

		// Camera

		let s = size();

		const aspectRatio = s.width / s.height;
		const fieldOfView = 60;
		const nearPlane   = 1;
		const farPlane    = 10000;
		camera            = new THREE.PerspectiveCamera(
			fieldOfView,
			aspectRatio,
			nearPlane,
			farPlane
		);

		let distance      = 1.5;
		camera.position.x = distance * Settings.MAZE_SIZE;
		camera.position.z = distance * Settings.MAZE_SIZE;
		camera.position.y = .5 * distance * Settings.MAZE_SIZE;
		camera.lookAt( scene.position );

		let orbit = new THREE.OrbitControls( camera, renderer.domElement );

		// Lights

		var lights  = [];
		lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
		lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
		lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

		let d = 2 * Settings.MAZE_SIZE;
		lights[ 0 ].position.set( 0, 2 * d, 0 );
		lights[ 1 ].position.set( d, 2 * d, 2 * d );
		lights[ 2 ].position.set( -d, -2 * d, -d );

		scene.add( lights[ 0 ] );
		scene.add( lights[ 1 ] );
		scene.add( lights[ 2 ] );

		// Resize

		resize();
	},

	addVoxel: function ( x, y, z, color ) {
		let rgb = hsl( ((2 * color) % 360) / 360, .8, .5 );

		let geometry       = new THREE.BoxGeometry( 1, 1, 1 );
		let material       = new THREE.MeshPhongMaterial( { color: ((rgb[ 0 ] << 16) + (rgb[ 1 ] << 8) + (rgb[ 2 ])), shading: THREE.FlatShading } );
		let cube           = new THREE.Mesh( geometry, material );
		cube.position.x    = x - (Grid.WIDTH >> 1);
		cube.position.y    = y - (Grid.HEIGHT >> 1);
		cube.position.z    = z - (Grid.DEPTH >> 1);
		cube.castShadow    = true;
		cube.receiveShadow = true;
		mesh.add( cube );
	},

	render: function () {
// 		mesh.rotation.x += 0.005;
		mesh.rotation.y += 0.005;

		renderer.render( scene, camera );
	}
};

export default Display;
