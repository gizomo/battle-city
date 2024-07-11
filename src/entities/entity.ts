export type Position = Record<'x' | 'y', number>;

export default abstract class Entity {
	private readonly id: number;

	private isDead: boolean = false;
	private position: Position = { x: 0, y: 0 };

	protected abstract halfWidth: number;
	protected abstract halfHeight: number;

	constructor(id: number) {
		this.id = id;
	}

	public getId(): number {
		return this.id;
	}

	public setPosition(position: Position): void {
		this.position = position;
	}

	public getPosition(): Position {
		return this.position;
	}

	public getRadius(): number {
		return 0;
	}

	public kill(): void {
		this.isDead = true;
	}
}
