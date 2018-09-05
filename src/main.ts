interface Color {
	r: number;
	g: number;
	b: number;
}

interface Complex {
	r: number;
	i: number;
}

function cAdd(a: Complex, b: Complex) {
	return { r: a.r + b.r, i: a.i + b.i };
}

function cMul(a: Complex, b: Complex) {
	return {
		r: a.r * b.r - a.i * b.i,
		i: a.r * b.i + a.i * b.r,
	};
}

function cLengthSquared(a: Complex) {
	return a.r * a.r + a.i * a.i;
}

function cLength(a: Complex) {
	return Math.sqrt(cLengthSquared(a));
}

function cAngle(a: Complex) {
	return Math.atan(a.r / a.i);
}

async function makeImageReader(src: string) {
	var image = new Image();
	const imageLoaded = new Promise((resolve, reject) => {
		image.onload = resolve;
		image.onerror = reject;
	});
	image.src = src;
	await imageLoaded;

	var canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	const context = canvas.getContext("2d")!;
	context.drawImage(image, 0, 0, image.width, image.height);

	return (x: number, y: number): Color => {
		const pixelData = context.getImageData(
			(x * canvas.width) % canvas.width,
			(y * canvas.height) % canvas.height,
			1,
			1,
		).data;
		return {
			r: pixelData[0] / 255,
			g: pixelData[1] / 255,
			b: pixelData[2] / 255,
		};
	};
}

async function main() {
	// const image = await makeImageReader("./floor-tile.jpg");
	const image = await makeImageReader("./floor.png");

	const context = (document.getElementsByTagName(
		"canvas",
	)[0] as HTMLCanvasElement).getContext("2d")!;

	const pixelRatio = window.devicePixelRatio || 1;
	const canvasWidth = context.canvas.width;
	const canvasHeight = context.canvas.height;
	context.canvas.width = canvasWidth * pixelRatio;
	context.canvas.height = canvasHeight * pixelRatio;
	context.canvas.style.width = canvasWidth + "px";
	context.canvas.style.height = canvasHeight + "px";

	function drawPixel(x: number, y: number, color: Color) {
		context.fillStyle =
			"rgb(" + color.r * 255 + "," + color.g * 255 + "," + color.b * 255 + ")";
		context.fillRect(x, y, 1, 1);
	}

	const x = -0.7463;
	const y = 0.1102;
	const r = 0.005;

	const width = context.canvas.width;
	const height = context.canvas.height;
	const minX = x - r;
	const maxX = x + r;
	const minY = y - r;
	const maxY = y + r;
	for (let y = 0; y < height; ++y) {
		if (!(y % 10)) {
			await new Promise(resolve => setTimeout(resolve, 0));
		}
		for (let x = 0; x < width; ++x) {
			const c: Complex = {
				r: minX + ((maxX - minX) * x) / width,
				i: minY + ((maxY - minY) * y) / height,
			};

			let z: Complex = {
				r: 0,
				i: 0,
			};

			const maxIterations = 100;
			let i = 0;
			for (; cLengthSquared(z) < 2 * 2 && i < maxIterations; ++i) {
				z = cAdd(cMul(z, z), c);
			}

			// const u = Math.min(1, z.r/3);
			// const v = Math.min(1, z.i/3);

			const u = 1 - Math.min(1, cLength(z) / 3 - 1 / 2);
			const v = 1 + Math.min(1, cAngle(z) / (Math.PI / 2));

			const color = image(u, v);
			// const color = {
			// 	r: u,
			// 	g: v,
			// 	b: 0,
			// };

			drawPixel(x, y, color);
		}
	}
}

main();
