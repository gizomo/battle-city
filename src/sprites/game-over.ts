import { DRAFT_CANVAS } from '../globals';
import { Sprite } from './sprite';

export function getGameOver(): Sprite {
	return new Sprite(DRAFT_CANVAS, 289, 184, 31, 15, 1, 1);
}
