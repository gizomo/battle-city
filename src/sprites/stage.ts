import { DRAFT_CANVAS } from '../globals';
import { Sprite } from './sprite';

export function getStage(): Sprite {
	return new Sprite(DRAFT_CANVAS, 328, 176, 40, 8, 1, 1);
}
