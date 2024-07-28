import { GAME_CANVAS, GRID_SIZE, SPRITE_SCALE } from '../globals';

export class Sprite {
	private readonly image: HTMLCanvasElement;
	private x: number;
	private y: number;
	private width: number;
	private height: number;
	private halfWidth: number;
	private halfHeight: number;
	private scaledWidth: number;
	private scaledHeight: number;

	constructor(image: HTMLCanvasElement, x: number, y: number, width: number, height: number, columns: number = 1, rows: number = 1) {
		this.image = image;

		if (undefined !== x && undefined !== y && width && height && columns && rows) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.halfWidth = width / 2;
			this.halfHeight = height / 2;
			this.scaledWidth = this.width * SPRITE_SCALE;
			this.scaledHeight = this.height * SPRITE_SCALE;
		} else {
			this.width = this.image.width;
			this.height = this.image.height;
			this.x = 0;
			this.y = 0;
		}
	}

	public getWidth(): number {
		return this.width;
	}

	public getHeight(): number {
		return this.height;
	}

	public drawAt(ctx: CanvasRenderingContext2D, x: number, y: number): void {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
	}

	public drawCentredAt(ctx: CanvasRenderingContext2D, x: number, y: number, hw: number, hh: number): void {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height, x - hw, y - hh, this.scaledWidth, this.scaledHeight);
	}

	public drawScaledAt(ctx: CanvasRenderingContext2D, x: number, y: number) {
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height, x - this.halfWidth * SPRITE_SCALE, y - this.halfHeight * SPRITE_SCALE, this.scaledWidth, this.scaledHeight);
	}
}
