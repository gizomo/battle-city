import { CONSTS, GAME_CANVAS, GAME_CTX, GRID_SIZE } from '../globals';
import Entity from './abstract-entity';
import { getTerrain, Sprite } from '../sprites';

export default class Terrain extends Entity {
	protected halfWidth: number = GAME_CANVAS.width / GRID_SIZE / 2;
	protected halfHeight: number = GAME_CANVAS.height / GRID_SIZE / 2;
	protected type: CONSTS = CONSTS.TERRAIN_BLANK;

	private sprite: Sprite;
	private animationFrame: number = 0;
	private animationFrameCounter: number = 0;

	constructor(params: Record<string, any>) {
		super(params);

		if (params) {
			this.type = params.type ?? CONSTS.TERRAIN_BLANK;
		}

		this.sprite = getTerrain(this.type);
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

		// spatialManager.unregister(this);

		if (this.isWater()) {
			this.animationFrameCounter++;

			if (0 === this.animationFrameCounter % 30) {
				this.animationFrame = 0 === this.animationFrame ? 1 : 0;
			}
		}

		// spatialManager.register(this);
		return false;
	}

	public render(): void {
		if (this.isWater()) {
			this.sprite = getTerrain(this.type, this.animationFrame);
		}

		this.sprite.drawCentredAt(GAME_CTX, this.position.x, this.position.y, this.halfWidth, this.halfHeight);
	}
}
