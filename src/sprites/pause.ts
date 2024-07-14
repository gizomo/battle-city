import { DRAFT_CANVAS } from '../globals';
import { Sprite } from './sprite';

export function getPause(): Sprite {
	return new Sprite(DRAFT_CANVAS, 289, 176, 39, 7, 1, 1);
}
