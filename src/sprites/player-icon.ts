import { BRICK_CANVAS } from '../globals';
import { Sprite } from './sprite';

export function getPlayerIcon(player: 1 | 2 = 1): Sprite {
	return new Sprite(BRICK_CANVAS, 37, 2 === player ? 160 : 136, 16, 7, 1, 1);
}
