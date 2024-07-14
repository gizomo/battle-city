import { CONSTS, GAME_CANVAS, GRID_SIZE } from '../globals';
import Entity from './abstract-entity';

type PlayerReset = {
	position: Position;
	bulletVelocity: number;
	bulletStrength: number;
	canFireTwice: boolean;
	orientation: CONSTS;
};

enum ForceField {
	NONE,
	BRIEF,
	STRONG,
}

export default class PlayerTank extends Entity {
	private readonly soundIdle: string = 'tankIdle';
	private readonly soundMove: string = 'tankMove';

	private bulletVelocity: number = 6;
	private bulletStrength: number = 1;
	private bulletsAlive: number = 0;
	private canFireTwice: boolean = false;
	private forceField: ForceField = ForceField.NONE;
	private frozen: boolean = false;
	private gamepad: Gamepad;
	private isMoving: boolean = false;
	private isPlayer: boolean = true;
	private moveDistance: number = 2;
	private numberOfLives: number = 2;
	private orientation: CONSTS = CONSTS.DIRECTION_UP;
	private playerReset: PlayerReset;
	private starLevel: CONSTS = CONSTS.TANK_POWER_NONE;

	private animationFrame: 0 | 1 = 0;
	private animationFrameCounter: number = 0;

	protected halfWidth: number = GAME_CANVAS.width / GRID_SIZE - 3;
	protected halfHeight: number = GAME_CANVAS.height / GRID_SIZE - 3;
	protected type: CONSTS = CONSTS.TANK_PLAYER1;

	constructor(params?: Record<string, any>) {
		super(params);

		this.playerReset = {
			position: this.position,
			bulletVelocity: this.bulletVelocity,
			bulletStrength: this.bulletStrength,
			canFireTwice: this.canFireTwice,
			orientation: this.orientation,
		};
	}

	public reset(death: boolean = false): void {
		if (death) {
			this.starLevel = CONSTS.TANK_POWER_NONE;
			this.bulletVelocity = this.playerReset.bulletVelocity;
			this.canFireTwice = this.playerReset.canFireTwice;
			this.bulletStrength = this.playerReset.bulletStrength;
		}

		this.frozen = true;
		this.position = this.playerReset.position;
		// const doReset = () => this._doReset()
		// entityManager.generateEffect('spawnFlash', this, doReset);
	}

	public hasLifes(): boolean {
		return this.numberOfLives > 0;
	}

	public hasStrongField(): boolean {
		return ForceField.STRONG === this.forceField;
	}

	public update(units?: number): boolean {
		throw new Error('Method not implemented.');
	}

	public render(): void {
		throw new Error('Method not implemented.');
	}
}
