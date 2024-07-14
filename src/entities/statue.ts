import Entity from './abstract-entity';
import { CONSTS, FIRST_STEP, GAME_CANVAS, GAME_CTX, GRID_SIZE, GRID_STEP, SPRITE_SCALE } from '../globals';
import { getStructure, Sprite } from '../sprites';

export default class Statue extends Entity {
	protected halfWidth: number = GAME_CANVAS.width / GRID_SIZE;
	protected halfHeight: number = GAME_CANVAS.height / GRID_SIZE;
	protected type: CONSTS = CONSTS.STRUCTURE_FLAG;

	private rotation: CONSTS = CONSTS.DIRECTION_UP;
	private scale: number = SPRITE_SCALE;
	private sprite: Sprite;

	constructor() {
		super({
			position: {
				x: FIRST_STEP + GRID_STEP * 12.5,
				y: FIRST_STEP + GRID_STEP * 24.5,
			},
		});
	}

	public update(): boolean {
		// spatialManager.unregister(this);
		// if (this._isDeadNow)
		//     return entityManager.KILL_ME_NOW;
		// spatialManager.register(this);
		return false;
	}

	public takeBulletHit(bullet: any): boolean {
		this.sprite = getStructure(CONSTS.STRUCTURE_FLAG, CONSTS.STRUCTURE_ALL_GONE);
		// var coords = {cx: this.cx, cy: this.cy};
		// g_SFX.request(bullet.soundDestroyPlayer);
		// entityManager.generateEffect("explosionBig", coords);
		// // game over
		// setTimeout(function () { main.gameOver(); } , 1000);
		return true;
	}

	public render(): void {
		this.sprite.drawCentredAt(GAME_CTX, this.position.x, this.position.y, this.halfWidth, this.halfHeight);
	}
}
