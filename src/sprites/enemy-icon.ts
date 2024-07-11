import { BRICK_CANVAS } from '../globals';
import { Sprite } from './sprite';

export function getEnemyIcon(): Sprite {
	return new Sprite(BRICK_CANVAS, 320, 192, 8, 8, 1, 1);
}
