import { DRAFT_CANVAS, CONSTS } from '../globals';
import { Sprite } from './sprite';

export function getPowerup(type: CONSTS): Sprite {
	const mul: number = 16;
	let x: number = 256;
	let y: number = 112;

	switch (type) {
		case CONSTS.POWERUP_HELMET:
			break;
		case CONSTS.POWERUP_TIMER:
			x += mul * 1;
			break;
		case CONSTS.POWERUP_SHOVEL:
			x += mul * 2;
			break;
		case CONSTS.POWERUP_STAR:
			x += mul * 3;
			break;
		case CONSTS.POWERUP_GRENADE:
			x += mul * 4;
			break;
		case CONSTS.POWERUP_TANK:
			x += mul * 5;
			break;
	}

	return new Sprite(DRAFT_CANVAS, x, y, 16, 16, 1, 1);
}
