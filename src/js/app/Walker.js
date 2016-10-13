"use strict";

import {Settings} from "./Settings";

import r from "../helpers/r1-1";
import shuffle from "../helpers/shuffle";

import {Grid} from "./Grid";

export class Walker {
	constructor( x, y, z, color ) {
		this.x = Math.round( x );
		this.y = Math.round( y );
		this.z = Math.round( z );

		this.color = Math.round( color + 3 * r() ) % 360;

		Grid.setVoxel( this.x, this.y, this.z, this.color );
	}

	process() {
		let candidates = [];

		let positions = shuffle( [
									 [ 1, 0, 0 ],
									 [ -1, 0, 0 ],
									 [ 0, 1, 0 ],
									 [ 0, -1, 0 ],
									 [ 0, 0, 1 ],
									 [ 0, 0, -1 ]
								 ] );

		positions.forEach( p => {
			if ( !p ) {
				return;
			}

			if ( candidates.length >= Settings.WALKER_SPLIT ) {
				return;
			}

			let dx = p[ 0 ];
			let dy = p[ 1 ];
			let dz = p[ 2 ];

			if ( (this.x + 3 * dx >= 0) && (this.x + 3 * dx < Grid.WIDTH) &&
				 (this.y + 3 * dy >= 0) && (this.y + 3 * dy < Grid.HEIGHT) &&
				 (this.z + 3 * dz >= 0) && (this.z + 3 * dz < Grid.DEPTH)
				 && !Grid.getVoxel( this.x + dx, this.y + dy, this.z + dz ) ) {

				if ( ( dx != 0 )
					 && !Grid.getVoxel( this.x + dx, this.y - 1, this.z - 1 )
					 && !Grid.getVoxel( this.x + dx, this.y - 1, this.z + 0 )
					 && !Grid.getVoxel( this.x + dx, this.y - 1, this.z + 1 )
					 && !Grid.getVoxel( this.x + dx, this.y + 0, this.z - 1 )
					 && !Grid.getVoxel( this.x + dx, this.y + 0, this.z + 1 )
					 && !Grid.getVoxel( this.x + dx, this.y + 1, this.z - 1 )
					 && !Grid.getVoxel( this.x + dx, this.y + 1, this.z + 0 )
					 && !Grid.getVoxel( this.x + dx, this.y + 1, this.z + 1 )
					 && !Grid.getVoxel( this.x + 2 * dx, this.y - 1, this.z - 1 )
					 && !Grid.getVoxel( this.x + 2 * dx, this.y - 1, this.z + 0 )
					 && !Grid.getVoxel( this.x + 2 * dx, this.y - 1, this.z + 1 )
					 && !Grid.getVoxel( this.x + 2 * dx, this.y + 0, this.z - 1 )
					 && !Grid.getVoxel( this.x + 2 * dx, this.y + 0, this.z + 1 )
					 && !Grid.getVoxel( this.x + 2 * dx, this.y + 1, this.z - 1 )
					 && !Grid.getVoxel( this.x + 2 * dx, this.y + 1, this.z + 0 )
					 && !Grid.getVoxel( this.x + 2 * dx, this.y + 1, this.z + 1 )
					 && !Grid.getVoxel( this.x + 3 * dx, this.y, this.z )
				) {
					Grid.setVoxel( this.x + dx, this.y, this.z, this.color );
					Grid.setVoxel( this.x + 2 * dx, this.y, this.z, this.color );
					candidates.push( new Walker( this.x + 3 * dx, this.y, this.z, this.color ) );
				}
				if ( (dy != 0)
					 && !Grid.getVoxel( this.x - 1, this.y + dy, this.z - 1 )
					 && !Grid.getVoxel( this.x - 1, this.y + dy, this.z + 0 )
					 && !Grid.getVoxel( this.x - 1, this.y + dy, this.z + 1 )
					 && !Grid.getVoxel( this.x + 0, this.y + dy, this.z - 1 )
					 && !Grid.getVoxel( this.x + 0, this.y + dy, this.z + 1 )
					 && !Grid.getVoxel( this.x + 1, this.y + dy, this.z - 1 )
					 && !Grid.getVoxel( this.x + 1, this.y + dy, this.z + 0 )
					 && !Grid.getVoxel( this.x + 1, this.y + dy, this.z + 1 )
					 && !Grid.getVoxel( this.x - 1, this.y + 2 * dy, this.z - 1 )
					 && !Grid.getVoxel( this.x - 1, this.y + 2 * dy, this.z + 0 )
					 && !Grid.getVoxel( this.x - 1, this.y + 2 * dy, this.z + 1 )
					 && !Grid.getVoxel( this.x + 0, this.y + 2 * dy, this.z - 1 )
					 && !Grid.getVoxel( this.x + 0, this.y + 2 * dy, this.z + 1 )
					 && !Grid.getVoxel( this.x + 1, this.y + 2 * dy, this.z - 1 )
					 && !Grid.getVoxel( this.x + 1, this.y + 2 * dy, this.z + 0 )
					 && !Grid.getVoxel( this.x + 1, this.y + 2 * dy, this.z + 1 )
					 && !Grid.getVoxel( this.x, this.y + 3 * dy, this.z )
				) {

					Grid.setVoxel( this.x, this.y + dy, this.z, this.color );
					Grid.setVoxel( this.x, this.y + 2 * dy, this.z, this.color );
					candidates.push( new Walker( this.x, this.y + 3 * dy, this.z, this.color ) );
				}
				if ( (dz != 0)
					 && !Grid.getVoxel( this.x - 1, this.y - 1, this.z + dz )
					 && !Grid.getVoxel( this.x - 1, this.y + 0, this.z + dz )
					 && !Grid.getVoxel( this.x - 1, this.y + 1, this.z + dz )
					 && !Grid.getVoxel( this.x + 0, this.y - 1, this.z + dz )
					 && !Grid.getVoxel( this.x + 0, this.y + 1, this.z + dz )
					 && !Grid.getVoxel( this.x + 1, this.y - 1, this.z + dz )
					 && !Grid.getVoxel( this.x + 1, this.y + 0, this.z + dz )
					 && !Grid.getVoxel( this.x + 1, this.y + 1, this.z + dz )
					 && !Grid.getVoxel( this.x - 1, this.y - 1, this.z + 2 * dz )
					 && !Grid.getVoxel( this.x - 1, this.y + 0, this.z + 2 * dz )
					 && !Grid.getVoxel( this.x - 1, this.y + 1, this.z + 2 * dz )
					 && !Grid.getVoxel( this.x + 0, this.y - 1, this.z + 2 * dz )
					 && !Grid.getVoxel( this.x + 0, this.y + 1, this.z + 2 * dz )
					 && !Grid.getVoxel( this.x + 1, this.y - 1, this.z + 2 * dz )
					 && !Grid.getVoxel( this.x + 1, this.y + 0, this.z + 2 * dz )
					 && !Grid.getVoxel( this.x + 1, this.y + 1, this.z + 2 * dz )
					 && !Grid.getVoxel( this.x, this.y, this.z + 3 * dz )
				) {
					Grid.setVoxel( this.x, this.y, this.z + dz, this.color );
					Grid.setVoxel( this.x, this.y, this.z + 2 * dz, this.color );
					candidates.push( new Walker( this.x, this.y, this.z + 3 * dz, this.color ) );
				}
			}
		} );

		return candidates;
	}
}
