import Entity from './abstract-entity';
import Sounds from '../modules/sounds';
import type Bullet from './bullet';
import { CONSTS, FIRST_STEP, GAME_CANVAS, GAME_CTX, GRID_SIZE, GRID_STEP, SOUNDS } from '../globals';
import { getStructure, Sprite } from '../sprites';

export default class Statue extends Entity {
	protected halfWidth: number = GAME_CANVAS.width / GRID_SIZE;
	protected halfHeight: number = GAME_CANVAS.height / GRID_SIZE;
	protected type: CONSTS = CONSTS.STRUCTURE_FLAG;

	private sprite: Sprite;

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
		return this.isKilled();
	}

	public render(): void {
		this.sprite.drawCentredAt(GAME_CTX, this.position.x, this.position.y, this.halfWidth, this.halfHeight);
	}
}
