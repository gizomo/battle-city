import { CONSTS } from '../globals';

export default abstract class Entity {
	private readonly id: number;

	private isDead: boolean = false;
	private _position: Position = { x: 0, y: 0 };

	protected abstract type: CONSTS;
	protected abstract halfWidth: number;
	protected abstract halfHeight: number;

	public abstract update(units?: number): boolean;
	public abstract render(): void;

	constructor(params?: Record<string, any>) {
		if (params) {
			this.isDead = params.isDead ?? false;
			this.position = params.position ?? { x: 0, y: 0 };
			this.id = params.id ?? NaN;
		}
	}

	public getId(): number {
		return this.id;
	}

	public set position(position: Position) {
		this._position = position;
	}

	public get position(): Position {
		return this._position;
	}

	public get radius(): number {
		return 0;
	}

	public kill(): void {
		this.isDead = true;
	}
}
