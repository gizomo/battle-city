export default class ImageExtended extends Image {
	public static preloadImages(images: Record<string, string>): Promise<Record<string, ImageExtended>> {
		const requests: Promise<ImageExtended>[] = [];

		for (const imageId in images) {
			if (images.hasOwnProperty(imageId)) {
				const image: ImageExtended = new ImageExtended(imageId);
				requests.push(image.load(images[imageId]).then(() => image));
			}
		}

		return Promise.all(requests).then((result: ImageExtended[]) => {
			const images: Record<string, ImageExtended> = {};
			result.forEach((image: ImageExtended) => (images[image.id] = image));

			return images;
		});
	}

	constructor(id: string, width?: number, height?: number) {
		super(width, height);

		this.id = id;
	}

	public load(src: string): Promise<void> {
		return new Promise((resolve: () => void, reject: () => void) => {
			this.onload = resolve;
			this.onerror = reject;
			this.src = src;
		});
	}
}
