import { CONSTS, GAME_CANVAS, GRID_SIZE } from '../globals';
import { getStructure, Sprite } from '../sprites';
import Entity from './abstract-entity';

export default class Brick extends Entity {
	protected halfWidth: number = GAME_CANVAS.width / GRID_SIZE / 2;
	protected halfHeight: number = GAME_CANVAS.height / GRID_SIZE / 2;
	protected type: CONSTS = CONSTS.STRUCTURE_WHOLE;

	private sprite: Sprite;
	private look: CONSTS = CONSTS.STRUCTURE_BRICK;
	private scale: number = 1;
	private horizontal: [boolean, boolean] = [true, true];
	private vertical: [boolean, boolean] = [true, true];

	constructor(params: Record<string, any>) {
		super(params);

		if (params) {
			this.type = params.type ?? CONSTS.STRUCTURE_BRICK;
			this.look = params.look ?? CONSTS.STRUCTURE_WHOLE;
			this.scale = params.scale ?? 1;
			this.horizontal = params.horizontal ?? [true, true];
			this.vertical = params.vertical ?? [true, true];
		}

		this.sprite = getStructure(this.type, this.look);
	}
}
