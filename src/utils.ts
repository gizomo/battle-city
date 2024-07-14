export function preloadImages(images: Record<string, string>): Promise<Record<string, HTMLImageElement>> {
	const requests: Promise<[string, HTMLImageElement]>[] = [];

	for (const key in images) {
		if (images.hasOwnProperty(key)) {
			const image: HTMLImageElement = new Image();
			requests.push(
				new Promise((resolve: (value: unknown) => void, reject: () => void) => {
					image.onload = resolve;
					image.onerror = reject;
					image.src = images[key];
				}).then(() => [key, image])
			);
		}
	}

	return Promise.all(requests).then((result: [string, HTMLImageElement][]) => {
		const images: Record<string, HTMLImageElement> = {};
		result.forEach(([key, image]: [string, HTMLImageElement]) => (images[key] = image));

		return images;
	});
}

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
