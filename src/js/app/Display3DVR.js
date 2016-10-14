"use strict";

import {Settings} from "./Settings";
import {Grid} from "./Grid";

import fullscreen from "../helpers/fullscreen";
import hsl from "../helpers/hsl";

import {size} from "../helpers/viewport";

let scene;
let mesh;
let camera;
let controls;
let effect;

const renderer = new THREE.WebGLRenderer( {
	antialias: true
} );

// UI

const vrUI     = document.createElement( 'div' );
vrUI.className = "ui";
vrUI.innerHTML = ` 
    <button class="fullscreen">Fullscreen</button>
    <button class="vr">VR (WebVR/Mobile only)</button>
    <button class="reset">Reset</button>
`;

// Resize

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
		// Resize

		resize();

		// UI

		window.WebVRConfig = {
			BUFFER_SCALE: 1.0,
		};
		document.addEventListener( 'touchmove', function ( e ) {
			e.preventDefault();
		} );

		document.body.appendChild( renderer.domElement );
		document.body.appendChild( vrUI );

		vrUI.querySelector( '.fullscreen' ).addEventListener( 'click', function () {
			fullscreen( renderer.domElement );
		} );

		vrUI.querySelector( '.vr' ).addEventListener( 'click', function () {
			vrDisplay.requestPresent( [ { source: renderer.domElement } ] );
		} );

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

		mesh.position.z = -2 * Settings.MAZE_SIZE;

		// Controls

		controls = new THREE.VRControls( camera );

		effect = new THREE.VREffect( renderer );
		effect.setSize( s.width, s.height );

		let vrDisplay = null;
		navigator.getVRDisplays().then( function ( displays ) {
			if ( displays.length > 0 ) {
				vrDisplay = displays[ 0 ];
			}
		} );

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
	},

	addVoxel: function ( x, y, z, color ) {
		let rgb = hsl( ((2 * color) % 360) / 360, .8, .5 );

		let geometry     = new THREE.BoxGeometry( 1, 1, 1 );
		let material     = new THREE.MeshPhongMaterial( { color: ((rgb[ 0 ] << 16) + (rgb[ 1 ] << 8) + (rgb[ 2 ])), shading: THREE.FlatShading } );
		material.shading = THREE.FlatShading;
		let cube         = new THREE.Mesh( geometry, material );

		cube.position.x    = x - (Grid.WIDTH >> 1);
		cube.position.y    = y - (Grid.HEIGHT >> 1);
		cube.position.z    = z - (Grid.DEPTH >> 1);
		cube.castShadow    = true;
		cube.receiveShadow = true;
		mesh.add( cube );
	},

	render: function () {
// 		controls.update();

		mesh.rotation.x += 0.002;
		mesh.rotation.y += 0.005;

		effect.render( scene, camera );
	}
};

export default Display;
