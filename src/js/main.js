"use strict";

const ready = require( 'mf-js/modules/dom/ready' );

import {Settings} from "./app/Settings";

import shuffle from "./helpers/shuffle";

// GRID

import {Grid} from "./app/Grid";

// DISPLAY

import Display from "./app/Display3D";

// WALKER

import {Walker} from "./app/Walker";

// INIT

let walkers;

const init = e => {
	console.log( 'main.init' );

	Grid.init( Settings.MAZE_SIZE, Settings.MAZE_SIZE, Settings.MAZE_SIZE );
	Grid.setDisplay( Display );

	Display.init();

	walkers = [
		new Walker(
			Math.floor( .5 * Grid.WIDTH ),
			Math.floor( .5 * Grid.HEIGHT ),
			Math.floor( .5 * Grid.DEPTH ),
			Math.floor( 360 * Math.random() ),
		)
	];
};

const process = e => {
	if ( walkers.length > 0 ) {
		let new_walkers = [];

		walkers.forEach( w => {
			new_walkers = new_walkers.concat( w.process() );
		} );

		walkers = shuffle( new_walkers ).slice( 0, 10 );
	}

	Display.render();
	window.requestAnimationFrame( process );
};

ready( _ => {
	init();
	process();

	document.querySelector( '.reset' ).addEventListener( 'click', _ => {
		init();
	} );
} );
