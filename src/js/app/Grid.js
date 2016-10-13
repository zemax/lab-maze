"use strict";

let voxels;

export const Grid = {
	WIDTH:  0,
	HEIGHT: 0,
	DEPTH:  0,

	init:       function ( width, height, depth ) {
		[ this.WIDTH, this.HEIGHT, this.DEPTH ] = [ width, height, depth ];

		voxels = new Uint8Array( new ArrayBuffer( width * height * depth ) );
	},
	setDisplay: function ( display ) {
		this.display = display;
	},
	setVoxel:   function ( x, y, z, color ) {
		voxels[ z * this.HEIGHT * this.WIDTH + y * this.WIDTH + x ] = color >> 1;

		this.display.addVoxel( x, y, z, color );
	},
	getVoxel:   function ( x, y, z ) {
		return (voxels[ z * this.HEIGHT * this.WIDTH + y * this.WIDTH + x ] << 1);
	}
};
