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
	return { r: a.r * b.r + a.i * b.i, i: a.r * b.i + a.i * b.r };
}

function cLengthSquared(a: Complex) {
	return a.r * a.r + a.i * a.i;
}

function cLength(a: Complex) {
	return Math.sqrt(cLengthSquared(a));
}

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

const width = context.canvas.width;
const height = context.canvas.height;
const minX = -1;
const maxX = 1;
const minY = -1;
const maxY = 1;
for (let y = 0; y < height; ++y) {
	for (let x = 0; x < width; ++x) {
		const c: Complex = {
			r: minX + ((maxX - minX) * x) / width,
			i: minY + ((maxY - minY) * y) / height,
		};

		let z: Complex = {
			r: 0,
			i: 0,
		};

		for (let i = 0; cLengthSquared(z) < 2 * 2 && i < 100; ++i) {
			z = cAdd(cMul(z, z), c);
		}

		const a = Math.min(1, cLength(z) / 4);

		const color = {
			r: a,
			g: a * a,
			b: Math.pow(a, 1 / 2),
		};

		drawPixel(x, y, color);
	}
}
