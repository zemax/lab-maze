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

/**************************************************
 * THREE RENDERER
 **************************************************/

const clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer( {
	antialias: true,
} );

/**************************************************
 * UI
 **************************************************/

const vrUI     = document.createElement( 'div' );
vrUI.className = "ui";
vrUI.innerHTML = ` 
    <button class="fullscreen">Fullscreen</button>
    <button class="vr">VR (WebVR/Mobile only)</button>
    <button class="reset">Reset</button>
`;

/**************************************************
 * RESIZE
 **************************************************/

const resize = function () {
	let s = size();

	if ( !!renderer ) {
		renderer.setSize( s.width, s.height );

		if ( !!window.devicePixelRatio ) {
			renderer.setPixelRatio( window.devicePixelRatio );
		}
	}

	if ( !!effect ) {
		effect.setSize( s.width, s.height );
	}

	if ( !!camera ) {
		camera.aspect = s.width / s.height;
		camera.updateProjectionMatrix();
	}
};

window.addEventListener( 'resize', resize, false );

/**************************************************
 * DISPLAY
 **************************************************/

const Display = {
	init: function () {
		let s = size();

		// Renderer

		document.body.appendChild( renderer.domElement );

		// UI

		document.body.appendChild( vrUI );

		vrUI.querySelector( '.fullscreen' ).addEventListener( 'click', function () {
			fullscreen( renderer.domElement );
		} );

		vrUI.querySelector( '.vr' ).addEventListener( 'click', function () {
			ground.position.z = -2 * Settings.MAZE_SIZE;
			mesh.position.z   = -2 * Settings.MAZE_SIZE;

			controls = new THREE.VRControls( camera );
			controls.update();

			vrDisplay.requestPresent( [ { source: renderer.domElement } ] );
		} );

		// Scene

		scene = new THREE.Scene();

		// Ground

		let geometry = new THREE.PlaneGeometry( 3 * Settings.MAZE_SIZE, 3 * Settings.MAZE_SIZE );
		geometry.rotateX( Math.PI / 2 );
		let material      = new THREE.MeshBasicMaterial( { color: 0x333333, side: THREE.DoubleSide } );
		let ground        = new THREE.Mesh( geometry, material );
		ground.position.y = -Settings.MAZE_SIZE;
		scene.add( ground );

		// Mesh

		mesh = new THREE.Object3D();
		scene.add( mesh );

		// Camera

		camera = new THREE.PerspectiveCamera(
			60,                   // fieldOfView,
			(s.width / s.height), // aspectRatio,
			1,                    // nearPlane,
			10000,                // farPlane
		);

		let distance      = 1.5;
		camera.position.x = distance * Settings.MAZE_SIZE;
		camera.position.z = distance * Settings.MAZE_SIZE;
		camera.position.y = .5 * distance * Settings.MAZE_SIZE;
		camera.lookAt( scene.position );

		// Renderer

		effect = new THREE.VREffect( renderer );
		effect.setSize( s.width, s.height );

		let vrDisplay = null;
		if ( !!navigator.getVRDisplays ) {
			navigator.getVRDisplays().then( function ( displays ) {
				if ( displays.length > 0 ) {
					vrDisplay = displays[ 0 ];
					document.body.setAttribute( 'vr-enabled', 'true' );
				}
			} );
		}

		// Lights

		let light = new THREE.DirectionalLight( 0xffffff, 1 );
		light.position.set( .5, 1, .2 );
		scene.add( light );

		light = new THREE.DirectionalLight( 0xffffff, .5 );
		light.position.set( -1, -1, -1 );
		scene.add( light );

		// Resize

		resize();

		// Controls

		controls            = new THREE.OrbitControls( camera, renderer.domElement );
		controls.enableZoom = false;
		controls.enablePan  = false;
	},

	addVoxel: function ( x, y, z, color ) {
		let rgb = hsl( ((2 * color) % 360) / 360, .8, .5 );

// 		let geometry = new THREE.BoxGeometry( .8, .8, .8 );
		let geometry = new THREE.BoxGeometry( 1, 1, 1 );
		let material = new THREE.MeshPhongMaterial( { color: ((rgb[ 0 ] << 16) + (rgb[ 1 ] << 8) + (rgb[ 2 ])), shading: THREE.FlatShading } );
		let cube     = new THREE.Mesh( geometry, material );

		cube.position.x = x - (Grid.WIDTH >> 1);
		cube.position.y = y - (Grid.HEIGHT >> 1);
		cube.position.z = z - (Grid.DEPTH >> 1);
		mesh.add( cube );
	},

	render: function () {
		let dt = clock.getDelta();

		controls.update();

		mesh.rotation.x += 0.1 * dt;
		mesh.rotation.y += 0.3 * dt;

		if ( !!effect ) {
			effect.render( scene, camera );
		}
		else if ( !!renderer ) {
			renderer.render( scene, camera );
		}
	}
};

export default Display;
