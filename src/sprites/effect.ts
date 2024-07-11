import { BRICK_CANVAS, CONSTS } from '../globals';
import { Sprite } from './sprite';

export function getEffect(type: CONSTS, frameNumber: number): Sprite {
	const mul: number = 16;
	let x: number = 256;
	let y: number = 96;
	let width: number = 16;
	let height: number = 16;

	switch (type) {
		case CONSTS.EFFECT_SPAWNFLASH:
			x = x + mul * 0 + mul * frameNumber;
			break;
		case CONSTS.EFFECT_SMALLEXPLOSION:
			x = x + mul * frameNumber;
			y = y + mul * 2;
			break;
		case CONSTS.EFFECT_LARGEEXPLOSION:
			width = 32;
			height = 32;
			x = x + mul * 3 + mul * 2 * frameNumber;
			y = y + mul * 2;
			break;
		case CONSTS.EFFECT_INVULNERABLE:
			x = x + mul * frameNumber;
			y = y + mul * 3;
			break;
		case CONSTS.EFFECT_POINTS:
			x = x + mul * 2 + mul * frameNumber;
			y += mul * 4;
			break;
	}
	return new Sprite(BRICK_CANVAS, x, y, width, height, 1, 1);
}
