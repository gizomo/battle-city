export function clearCanvas(ctx: CanvasRenderingContext2D, color: string = 'rgb(99, 99, 99)'): void {
	const prevfillStyle: string | CanvasGradient | CanvasPattern = ctx.fillStyle;
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fillStyle = prevfillStyle;
}

export function fillBox(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, style: string | CanvasGradient | CanvasPattern) {
	const oldStyle: string | CanvasGradient | CanvasPattern = ctx.fillStyle;
	ctx.fillStyle = style;
	ctx.fillRect(x, y, width, height);
	ctx.fillStyle = oldStyle;
}
