import Entity from './abstract-entity';
import Sounds from '../modules/sounds';
import type Bullet from './bullet';
import { CONSTS, FIRST_STEP, GAME_CTX, GRID_STEP, SOUNDS } from '../globals';
import { getStructure, Sprite } from '../sprites';

export default class Statue extends Entity {
	protected halfWidth: number = GRID_STEP;
	protected halfHeight: number = GRID_STEP;
	protected type: CONSTS = CONSTS.STRUCTURE_FLAG;

	private sprite: Sprite = getStructure(CONSTS.STRUCTURE_FLAG);

	constructor() {
		super({
			position: {
				x: FIRST_STEP + GRID_STEP * 12.5,
				y: FIRST_STEP + GRID_STEP * 24.5,
			},
		});
	}

	public takeBulletHit = (bullet: Bullet) => {
		this.sprite = getStructure(CONSTS.STRUCTURE_FLAG, CONSTS.STRUCTURE_ALL_GONE);
		Sounds.request(SOUNDS.DESTROY_PLAYER);
		this.manager.generateEffect(CONSTS.EFFECT_LARGEEXPLOSION, this);
		this.kill();

		return true;
	};

	public update(): boolean {
		return false;
	}

	public render(): void {
		this.sprite.drawCentredAt(GAME_CTX, this.position.x, this.position.y, this.halfWidth, this.halfHeight);
	}
}
