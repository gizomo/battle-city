import Entity from './abstract-entity';
import { CONSTS, GAME_CTX, GRID_STEP } from '../globals';
import { getTerrain, Sprite } from '../sprites';

export default class Terrain extends Entity {
	protected halfWidth: number = GRID_STEP / 2;
	protected halfHeight: number = GRID_STEP / 2;
	protected type: CONSTS = CONSTS.TERRAIN_BLANK;

	private animationFrame: number = 0;
	private animationFrameCounter: number = 0;

	constructor(params: Record<string, any>) {
		super(params);

		if (params) {
			this.type = params.type ?? CONSTS.TERRAIN_BLANK;
		}

		this.collisional = !this.isTrees() || !this.isIce();
	}

	public isWater(): boolean {
		return CONSTS.TERRAIN_WATER === this.type;
	}

	public isTrees(): boolean {
		return CONSTS.TERRAIN_TREES === this.type;
	}

	public isIce(): boolean {
		return CONSTS.TERRAIN_ICE === this.type;
	}

	public update(): boolean {
		if (this.isIce() || this.isTrees()) {
			return false;
		}

		if (this.isWater()) {
			this.animationFrameCounter++;

			if (0 === this.animationFrameCounter % 30) {
				this.animationFrame = 0 === this.animationFrame ? 1 : 0;
			}
		}

		return false;
	}

	public render(): void {
		const sprite: Sprite = this.isWater() ? getTerrain(this.type, this.animationFrame) : getTerrain(this.type);
		sprite.drawCentredAt(GAME_CTX, this.position.x, this.position.y, this.halfWidth, this.halfHeight);
	}
}
