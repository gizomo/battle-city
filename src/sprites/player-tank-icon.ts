import { BRICK_CANVAS } from '../globals';
import { Sprite } from './sprite';

export function getPlayerTankIcon(): Sprite {
	return new Sprite(BRICK_CANVAS, 377, 144, 7, 6, 1, 1);
}
