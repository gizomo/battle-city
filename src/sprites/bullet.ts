import { DRAFT_CANVAS, CONSTS } from '../globals';
import { Sprite } from './sprite';

export function getBullet(direction: CONSTS): Sprite {
	const mul: number = 8;
	let x: number = 322;
	let y: number = 102;

	switch (direction) {
		case CONSTS.DIRECTION_UP:
			x += mul * 0;
			break;
		case CONSTS.DIRECTION_LEFT:
			x += mul * 1;
			break;
		case CONSTS.DIRECTION_DOWN:
			x += mul * 2;
			break;
		case CONSTS.DIRECTION_RIGHT:
			x += mul * 3;
			break;
	}

	return new Sprite(DRAFT_CANVAS, x, y, 4, 4, 1, 1);
}
