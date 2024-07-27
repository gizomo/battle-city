import Entity from './abstract-entity';
import Sounds from '../modules/sounds';
import type Bullet from './bullet';
import { CONSTS, GAME_CTX, GRID_STEP, SOUNDS } from '../globals';
import { fillBox } from '../utils';
import { getStructure, Sprite } from '../sprites';

export default class Brick extends Entity {
	protected halfWidth: number = GRID_STEP / 2;
	protected halfHeight: number = GRID_STEP / 2;
	protected type: CONSTS = CONSTS.STRUCTURE_WHOLE;

	private sprite: Sprite;
	private look: CONSTS = CONSTS.STRUCTURE_BRICK;
	private horizontal: [boolean, boolean] = [true, true];
	private vertical: [boolean, boolean] = [true, true];

	constructor(params: Record<string, any>) {
		super(params);

		if (params) {
			this.type = params.type ?? CONSTS.STRUCTURE_BRICK;
			this.look = params.look ?? CONSTS.STRUCTURE_WHOLE;
			this.horizontal = params.horizontal ?? [true, true];
			this.vertical = params.vertical ?? [true, true];
		}

		this.sprite = getStructure(this.type, this.look);
	}

	public takeBulletHit = (bullet: Bullet) => {
		if (2 === bullet.strength) {
			this.kill();

			if (bullet.isPlayer()) Sounds.request(SOUNDS.BULLET_BRICK_HIT);
		} else {
			if (this.isSteel()) {
				if (bullet.isPlayer()) Sounds.request(SOUNDS.BULLET_STEEL_HIT);
				return true;
			}

			switch (bullet.direction) {
				case CONSTS.DIRECTION_UP:
					if (this.vertical[0]) this.vertical[0] = false;
					else this.kill();
					break;
				case CONSTS.DIRECTION_DOWN:
					if (this.vertical[1]) this.vertical[1] = false;
					else this.kill();
					break;
				case CONSTS.DIRECTION_LEFT:
					if (this.horizontal[1]) this.horizontal[1] = false;
					else this.kill();
					break;
				case CONSTS.DIRECTION_RIGHT:
					if (this.horizontal[0]) this.horizontal[0] = false;
					else this.kill();
					break;
				default:
					break;
			}

			if ([false, false].toString() === this.vertical.toString() || [false, false].toString() === this.horizontal.toString()) this.kill();

			if ([true, false].toString() === this.horizontal.toString()) this.sprite = getStructure(this.type, CONSTS.STRUCTURE_RIGHT_GONE);
			else if ([false, true].toString() === this.horizontal.toString()) this.sprite = getStructure(this.type, CONSTS.STRUCTURE_LEFT_GONE);
			else if ([true, false].toString() === this.vertical.toString()) this.sprite = getStructure(this.type, CONSTS.STRUCTURE_TOP_GONE);
			else if ([false, true].toString() === this.vertical.toString()) this.sprite = getStructure(this.type, CONSTS.STRUCTURE_BOTTOM_GONE);

			if (bullet.isPlayer()) Sounds.request(SOUNDS.BULLET_BRICK_HIT);
		}

		return true;
	};

	public transformToBrick(): void {
		this.type = CONSTS.STRUCTURE_BRICK;
		this.sprite = getStructure(this.type, this.look);
	}

	public isSteel(): boolean {
		return CONSTS.STRUCTURE_STEEL === this.type;
	}

	public update(): boolean {
		return this.isKilled();
	}

	public render(): void {
		this.sprite.drawCentredAt(GAME_CTX, this.position.x, this.position.y, this.halfWidth, this.halfHeight);

		if ([true, false].toString() === this.horizontal.toString()) {
			if ([true, false].toString() === this.vertical.toString()) {
				fillBox(GAME_CTX, Math.floor(this.position.x - this.halfWidth), this.position.y - this.halfHeight - 1, this.halfWidth + 2, this.halfHeight + 1, '#000');
			}

			if ([false, true].toString() === this.vertical.toString()) {
				fillBox(GAME_CTX, Math.floor(this.position.x - this.halfWidth), this.position.y, this.halfWidth + 2, this.halfHeight + 1, '#000');
			}
		} else if ([false, true].toString() === this.horizontal.toString()) {
			if ([true, false].toString() === this.vertical.toString()) {
				fillBox(GAME_CTX, this.position.x - 1, this.position.y - this.halfHeight - 1, this.halfWidth + 2, this.halfHeight + 1, '#000');
			}

			if ([false, true].toString() === this.vertical.toString()) {
				fillBox(GAME_CTX, this.position.x - 1, this.position.y, this.halfWidth + 2, this.halfHeight + 1, '#000');
			}
		}
	}
}
