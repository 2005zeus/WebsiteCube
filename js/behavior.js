// Vars

// classses
class Vector2{
	constructor(x = 0, y = 0){
        this.X = x;
        this.Y = y;
	}
}

class Vector3{
    constructor(x = 0, y = 0, z = 0){
        this.X = x;
        this.Y = y;
        this.Z = z;
	}
	
	ToVec2(focalLength){
		var l = 1 / (focalLength - this.Z);

		var projectionMat = [
			[l, 0, 0],
			[0, l, 0]
		]

		var result = matMul(projectionMat, this);

		return new Vector2(result[0], result[1]);
	}
}

// vars
var Points = {
    // Points for a cube
    P0: new Vector3(-1, 1, 1),
    P1: new Vector3(1, 1, 1), 
    P2: new Vector3(1, -1, 1),
    P3: new Vector3(-1, -1, 1), 
    P4: new Vector3(-1, 1, -1), 
    P5: new Vector3(1, 1, -1),
    P6: new Vector3(1, -1, -1),
    P7: new Vector3(-1, -1, -1),
}

//-------------------------------------------------------------------------------------------
// Functions

function matMul(a, _b){
	// Matrix multiplication function
    var b = [_b.X, _b.Y, _b.Z];
    var result = [];

    for(let i = 0; i < a.length; i++){
		// Looping through every item in 'a'
		let sum = 0;
		
		for(let j = 0; j < a[i].length; j++){
			// Looping through every item in a[i]
			sum += a[i][j] * b[j];
		}
		result[i] = sum;
	}
	
	return result;
}

function rotate(pos, axis, angle){
	_angle = angle * (Math.PI / 180);

    // Rotate function
    var axisTable = {
		X: [
			[1, 0, 0],
			[0, Math.cos(_angle), -Math.sin(_angle)],
			[0, Math.sin(_angle), Math.cos(_angle)]
		],
		Y: [
			[Math.cos(_angle), 0, Math.sin(_angle)],
			[0, 1, 0],
			[-Math.sin(_angle), 0, Math.cos(_angle)]
		],
		Z: [
			[Math.cos(_angle), -Math.sin(_angle), 0],
			[Math.sin(_angle), Math.cos(_angle), 0],
			[0, 0, 1]
		]
	}

	let result = matMul(axisTable[axis], pos);
	let newPos = new Vector3(result[0], result[1], result[2])

	return newPos;
}

function createLine(startPos, endPos, ctx) {
    // Draws a line
    ctx.beginPath();
    ctx.moveTo((startPos.X * 200) + 300, (startPos.Y * 200) + 300);
	let thing = ctx.lineTo((endPos.X * 200) + 300, (endPos.Y * 200) + 300);
    ctx.stroke();
	
	return thing;
}

function connect(ctx, table){
	// Connects points
	let focal = 2.5;

	for(i = 0; i < 8; i += 4){
		// Connecting points to for 2 planes
		let startPos = table["P" + i].ToVec2(focal);
		let endPos = table["P" + (i + 1)].ToVec2(focal);

		createLine(startPos, endPos, ctx);
		//-----------

		let startPos1 = table["P" + i].ToVec2(focal);
		let endPos1 = table["P" + (i + 3)].ToVec2(focal);

		createLine(startPos1, endPos1, ctx);
		//-----------

		let startPos2 = table["P" + (i + 2)].ToVec2(focal);
		let endPos2 = table["P" + (i + 1)].ToVec2(focal);

		createLine(startPos2, endPos2, ctx);
		//-----------

		let startPos3 = table["P" + (i + 2)].ToVec2(focal);
		let endPos3 = table["P" + (i + 3)].ToVec2(focal);

		createLine(startPos3, endPos3, ctx);
	}
	for(i = 0; i < 4; i++){
		// Connecting those 2 planes
		let startPos = table["P" + i].ToVec2(focal);
		let endPos = table["P" + (i + 4)].ToVec2(focal);

		createLine(startPos, endPos, ctx);
	}
}
//-------------------------------------------------------------------------------------------

var angle = 0;

function loop(){
	window.requestAnimationFrame(loop);

	const canvas = document.querySelector('#canvas');

	const ctx = canvas.getContext('2d');

	// set line stroke and line width
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 2;

	ctx.clearRect(0, 0, canvas.width, canvas.height); // claring prev stuff

	angle += 0.5;
	var tempTable = {};

	for(i = 0; i < 8; i++){
		let rotated = rotate(Points["P" + i], "Y", angle);
		tempTable["P" + i] = rotated;
	}
	connect(ctx, tempTable);
}

function clicked(){
	loop();
}
