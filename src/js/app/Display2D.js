"use strict";

import {size} from "../helpers/viewport";

import {Settings} from "./Settings";
import {Grid} from "./Grid";

const stage = document.createElement( 'canvas' );
document.body.appendChild( stage );

const stageContext = stage.getContext( '2d' );

const resize = function () {
	let s = size();

	stage.width  = s.width;
	stage.height = s.height;
	stageContext.clearRect( 0, 0, stage.width, stage.height );
};

window.addEventListener( 'resize', resize, false );

const DOT = .5 * Settings.ZOOM;
const p3d = function ( x, y, z ) {
	return {
		x: .5 * stage.width + DOT * ((x - .5 * Settings.MAZE_SIZE) - .65 * (z - .5 * Settings.MAZE_SIZE)),
		y: .5 * stage.height - DOT * ((y - .5 * Settings.MAZE_SIZE) - .2 * (x - .5 * Settings.MAZE_SIZE) - .5 * (z - .5 * Settings.MAZE_SIZE))
	};
};

const Display = {
	init: function () {
		resize();
	},

	addVoxel: function ( x, y, z, color ) {
	},

	render: function () {
		stageContext.clearRect( 0, 0, stage.width, stage.height );

		for ( let z = 0; z < Grid.DEPTH; z++ ) {
			for ( let y = 0; y < Grid.HEIGHT; y++ ) {
				for ( let x = 0; x < Grid.WIDTH; x++ ) {
					let c = Grid.getVoxel( x, y, z );
					if ( !!c ) {
						c                      = (5 * x + 5 * y + 5 * z) % 360;
						stageContext.fillStyle = 'hsl(' + c + ',50%,75%)';
						stageContext.beginPath();
						stageContext.moveTo( p3d( x, y + 1, z ).x, p3d( x, y + 1, z ).y );
						stageContext.lineTo( p3d( x + 1, y + 1, z ).x, p3d( x + 1, y + 1, z ).y );
						stageContext.lineTo( p3d( x + 1, y + 1, z + 1 ).x, p3d( x + 1, y + 1, z + 1 ).y );
						stageContext.lineTo( p3d( x, y + 1, z + 1 ).x, p3d( x, y + 1, z + 1 ).y );
						stageContext.closePath();
						stageContext.fill();

						stageContext.fillStyle = 'hsl(' + c + ',50%,40%)';
						stageContext.beginPath();
						stageContext.moveTo( p3d( x + 1, y + 1, z ).x, p3d( x + 1, y + 1, z ).y );
						stageContext.lineTo( p3d( x + 1, y, z ).x, p3d( x + 1, y, z ).y );
						stageContext.lineTo( p3d( x + 1, y, z + 1 ).x, p3d( x + 1, y, z + 1 ).y );
						stageContext.lineTo( p3d( x + 1, y + 1, z + 1 ).x, p3d( x + 1, y + 1, z + 1 ).y );
						stageContext.closePath();
						stageContext.fill();

						stageContext.fillStyle = 'hsl(' + c + ',50%,60%)';
						stageContext.beginPath();
						stageContext.moveTo( p3d( x, y + 1, z + 1 ).x, p3d( x, y + 1, z + 1 ).y );
						stageContext.lineTo( p3d( x + 1, y + 1, z + 1 ).x, p3d( x + 1, y + 1, z + 1 ).y );
						stageContext.lineTo( p3d( x + 1, y, z + 1 ).x, p3d( x + 1, y, z + 1 ).y );
						stageContext.lineTo( p3d( x, y, z + 1 ).x, p3d( x, y, z + 1 ).y );
						stageContext.closePath();
						stageContext.fill();
					}
				}
			}
		}
	}
};

export default Display;
