import { DRAFT_CANVAS } from '../globals';
import { Sprite } from './sprite';

export function getFlagIcon(): Sprite {
	return new Sprite(DRAFT_CANVAS, 376, 184, 16, 15, 1, 1);
}
