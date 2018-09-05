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

function drawPixel(x, y, color: Color) {
	context.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
	context.fillRect(x, y, 1, 1);
}

for (let y = 0; y < context.canvas.clientWidth; ++y) {
	for (let x = 0; x < context.canvas.clientWidth; ++x) {
		const c: Complex = {
			r: x,
			i: y,
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
