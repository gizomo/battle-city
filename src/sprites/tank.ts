import { DRAFT_CANVAS, CONSTS } from '../globals';
import { Sprite } from './sprite';

export function getTank(type: CONSTS, power: CONSTS, direction: CONSTS, frameNumber: number, life?: number): Sprite {
	const mul: number = 16;
	let x: number = 0;
	let y: number = 0;

	switch (type) {
		case CONSTS.TANK_PLAYER1:
			x = 0;
			y = 0;
			break;
		case CONSTS.TANK_PLAYER2:
			x = 0;
			y = 128;
			break;
		case CONSTS.TANK_ENEMY_BASIC:
			x = 128;
			y = 64 + mul * 0;
			break;
		case CONSTS.TANK_ENEMY_FAST:
			x = 128;
			y = 64 + mul * 1;
			break;
		case CONSTS.TANK_ENEMY_POWER:
			x = 128;
			y = 64 + mul * 2;
			break;
		case CONSTS.TANK_ENEMY_ARMOR:
			// depending on life left, color of armored tanks goes:
			// green -> yellow -> green/yellow blinking -> gray
			// unless it has powerup, then it goes:
			// green/red -> yellow/red -> green/yellow/red -> gray/red
			if (CONSTS.TANK_POWER_DROPSPOWERUP === power) {
				// red
				x = 128;
				y = 64 + mul * 11;
			} else if (1 === life) {
				// gray
				x = 128;
				y = 64 + mul * 3;
			} else if (2 === life) {
				// green/yellow
				if (0 === frameNumber) {
					// green
					x = 0;
					y = 64 + mul * 11;
				} else {
					// frameNumber === 1, yellow
					x = 0;
					y = 64 + mul * 3;
				}
			} else if (3 === life) {
				// yellow
				x = 0;
				y = 64 + mul * 3;
			} else {
				// life === 4, green
				x = 0;
				y = 64 + mul * 11;
			}

			break;
	}

	if (CONSTS.TANK_PLAYER1 === type || CONSTS.TANK_PLAYER2 === type) {
		switch (power) {
			case CONSTS.TANK_POWER_NONE:
				break;
			case CONSTS.TANK_POWER_1STAR:
				y += mul * 1;
				break;
			case CONSTS.TANK_POWER_2STARS:
				y += mul * 2;
				break;
			case CONSTS.TANK_POWER_3STARS:
				y += mul * 3;
				break;
		}
	}

	if (CONSTS.TANK_ENEMY_ARMOR !== type && CONSTS.TANK_POWER_DROPSPOWERUP === power) {
		y += mul * 8;
	}

	switch (direction) {
		//HD: Need to be careful here. We're picking a sprite based on both
		//direction and animation count, so we jump over 2 at a time for
		//direction, then shift 1 *depending* on frame value. Remember: The
		//first frame has value 0, the second frame has value 1.
		case CONSTS.DIRECTION_UP:
			x = x + mul * 0 + mul * frameNumber;
			break;
		case CONSTS.DIRECTION_LEFT:
			x = x + mul * 2 + mul * frameNumber;
			break;
		case CONSTS.DIRECTION_DOWN:
			x = x + mul * 4 + mul * frameNumber;
			break;
		case CONSTS.DIRECTION_RIGHT:
			x = x + mul * 6 + mul * frameNumber;
			break;
	}

	return new Sprite(DRAFT_CANVAS, x, y, 16, 16, 1, 1);
}
