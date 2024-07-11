import { BRICK_CANVAS, CONSTS } from '../globals';
import { Sprite } from './sprite';

export function getTerrain(type: CONSTS, frameNumber: number): Sprite {
	const mul: number = 8;
	let x: number = 256;
	let y: number = 80;

	switch (type) {
		case CONSTS.TERRAIN_WATER:
			x += mul * (1 + frameNumber);
			break;
		case CONSTS.TERRAIN_TREES:
			x += mul * 1;
			y -= mul * 1;
			break;
		case CONSTS.TERRAIN_ICE:
			x += mul * 2;
			y -= mul * 1;
			break;
		case CONSTS.TERRAIN_BLANK:
			x += mul * 3;
			break;
	}

	return new Sprite(BRICK_CANVAS, x, y, 8, 8, 1, 1);
}
