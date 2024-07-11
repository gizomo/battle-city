import { BRICK_CANVAS } from '../globals';
import { Sprite } from './sprite';

export function getFlagIcon(): Sprite {
	return new Sprite(BRICK_CANVAS, 376, 184, 16, 15, 1, 1);
}
