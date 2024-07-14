import { DRAFT_CANVAS, CONSTS } from '../globals';
import { Sprite } from './sprite';

export function getStructure(type: CONSTS, look: CONSTS): Sprite {
	const mul: number = 8;
	let x: number = 256;
	let y: number = 64;
	let width: number = 8;
	let height: number = 8;

	switch (type) {
		case CONSTS.STRUCTURE_BRICK:
			break;
		case CONSTS.STRUCTURE_STEEL:
			y += mul * 1;
			break;
		case CONSTS.STRUCTURE_FLAG:
			x += mul * 6;
			y -= mul * 4;
			width = 16;
			height = 16;
			break;
		default:
			break;
	}

	switch (look) {
		case CONSTS.STRUCTURE_WHOLE:
			break;
		case CONSTS.STRUCTURE_LEFT_GONE:
			x += mul * 1;
			break;
		case CONSTS.STRUCTURE_TOP_GONE:
			x += mul * 2;
			break;
		case CONSTS.STRUCTURE_RIGHT_GONE:
			x += mul * 3;
			break;
		case CONSTS.STRUCTURE_BOTTOM_GONE:
			x += mul * 4;
			break;
		case CONSTS.STRUCTURE_ALL_GONE:
			if (CONSTS.STRUCTURE_FLAG === type) {
				x += mul * 2;
			} else {
				x += mul * 5;
			}

			break;
		default:
			break;
	}

	return new Sprite(DRAFT_CANVAS, x, y, width, height, 1, 1);
}
