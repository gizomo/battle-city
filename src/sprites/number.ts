import { BRICK_CANVAS } from '../globals';
import { Sprite } from './sprite';

export function getNumber(number: number): Sprite {
	const mul: number = 8;
	let x: number = 329;
	let y: number = 184;

	x += (number % 5) * mul;

	if (number > 4) {
		y += mul;
	}

	return new Sprite(BRICK_CANVAS, x, y, 7, 7, 1, 1);
}
