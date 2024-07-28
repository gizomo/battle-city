import { DRAFT_CANVAS } from '../globals';
import { Sprite } from './sprite';

export function getPlayerTankIcon(): Sprite {
	return new Sprite(DRAFT_CANVAS, 377, 144, 7, 8, 1, 1);
}
