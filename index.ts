// import { Matrix } from "./matrix";

const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);
const gl = canvas.getContext('webgl2',
    {
        antialias: false,
        premultipliedAlpha: false,
        alpha: true,
        depth: true,
        powerPreference: 'high-performance'
    })!;

function _processSourceForError(source: string, errorInfo: string) {
    if (!source) {
        return errorInfo;
    }
    const lines = source.split('\n');
    const errorLineStart = errorInfo.search(/\d:\d/);
    const errorLineEnd = errorInfo.indexOf(' ', errorLineStart);
    const [_, error2] = errorInfo.slice(errorLineStart, errorLineEnd).split(':').map(v => Number(v));
    for (let i = 0; i < lines.length; i++) {
        lines[i] = `${i + 1}: ${lines[i]}${error2 === (i + 1) ? ' <----- ERROR!' : ''}`;
    }

    return '\n\nSource:\n' + lines.join('\n');
}


// const ortho = Matrix.ortho(0, gl.canvas.width, gl.canvas.height, 0, 400, -400);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear background
gl.clearColor(0, 0, 0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Enable alpha blending
// https://www.realtimerendering.com/blog/gpus-prefer-premultiplication/
gl.enable(gl.BLEND);
gl.blendEquation(gl.FUNC_ADD);
gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);


// create shader programs
const glsl = (x: any) => x[0];
const txVertex = glsl`#version 300 es
    uniform float deltaMs;
    uniform vec2 gravity;

    layout(location=0) in vec2 position;
    layout(location=1) in vec2 velocity;
    layout(location=2) in float rotation;
    layout(location=3) in float angularVelocity;

    out vec2 finalPosition;
    out vec2 finalVelocity;
    out float finalRotation;
    out float finalAngularVelocity;
    void main() {
        float seconds = deltaMs / 1000.0;
        // euler integration
        finalVelocity = velocity + gravity * seconds;
        finalPosition = position + velocity * seconds + gravity * .5 * seconds * seconds;
        finalRotation = rotation + angularVelocity * seconds;
        finalAngularVelocity = angularVelocity; // todo weird artifact of re-using the same buffer layout for update/draw

        gl_Position = vec4(finalPosition, 0.0, 1.0);
        gl_PointSize = 10.0;
    }
`
const particleFrag = glsl`#version 300 es
    precision mediump float;

    out vec4 fragColor;
    void main() {

        float distanceFromPointCenter = distance(gl_PointCoord.xy, vec2(0.5));
        if (distanceFromPointCenter > .5) discard;

        // TODO particle colors as vertex attributes
        // TODO sprites/animations
        fragColor = vec4(1., .1, .1, 1.0);
    }
`

// Init program
const program = gl.createProgram()!;
const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
gl.shaderSource(vertexShader, txVertex);
gl.compileShader(vertexShader);
var success = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
if (!success) {
  const errorInfo = gl.getShaderInfoLog(vertexShader);
  throw Error(`Could not compile vertex shader:\n\n${errorInfo}${_processSourceForError(txVertex, errorInfo!)}`);
}
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
gl.shaderSource(fragmentShader, particleFrag);
gl.compileShader(fragmentShader);
var success = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
if (!success) {
  const errorInfo = gl.getShaderInfoLog(fragmentShader);
  throw Error(`Could not compile frag shader:\n\n${errorInfo}${_processSourceForError(particleFrag, errorInfo!)}`);
}
gl.attachShader(program, fragmentShader);

gl.transformFeedbackVaryings(program, ['finalPosition', 'finalVelocity', 'finalRotation', 'finalAngularVelocity'], gl.INTERLEAVED_ATTRIBS);
gl.linkProgram(program);

// Check for sadness
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

// Use if you have multiple transform feedback
// const tfo = gl.createTransformFeedback()!
// gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tfo);

// initalize data
const numParticles = 10000;
const numInputFloats = 2 + 2 + 1 + 1;
const particleData = new Float32Array(numParticles * numInputFloats);
const bytesPerFloat = 4;
for (let i = 0; i < numParticles * numInputFloats; i += numInputFloats) {
    particleData.set([
        Math.random()*2-1, Math.random()*2-1, // pos
        Math.random(), Math.random(),                        // velocity
        0,                            // rotation
        0                             // angular velocity
    ], i);
}


let vaos: WebGLVertexArrayObject[] = [];
let buffers: WebGLBuffer[] = [];

const particleDataBuffer1 = gl.createBuffer()!;
const vao1 = gl.createVertexArray()!;
gl.bindVertexArray(vao1);
gl.bindBuffer(gl.ARRAY_BUFFER, particleDataBuffer1);
gl.bufferData(gl.ARRAY_BUFFER, numParticles * numInputFloats * bytesPerFloat, gl.DYNAMIC_COPY);
gl.bufferSubData(gl.ARRAY_BUFFER, 0, particleData);
var offset = 0;
// position
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, numInputFloats * bytesPerFloat, 0);
offset += bytesPerFloat * 2;
// velocity
gl.vertexAttribPointer(1, 2, gl.FLOAT, false, numInputFloats * bytesPerFloat, offset);
offset += bytesPerFloat * 2
// rotation
gl.vertexAttribPointer(2, 1, gl.FLOAT, false, numInputFloats * bytesPerFloat, offset);
offset += bytesPerFloat * 1
// angularVelocity
gl.vertexAttribPointer(3, 1, gl.FLOAT, false, numInputFloats * bytesPerFloat, offset);
offset += bytesPerFloat * 1

// enable attributes
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);
gl.enableVertexAttribArray(2);
gl.enableVertexAttribArray(3);

vaos.push(vao1);
buffers.push(particleDataBuffer1);
// Clean up
gl.bindVertexArray(null);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const particleDataBuffer2 = gl.createBuffer()!;
const vao2 = gl.createVertexArray()!;
gl.bindVertexArray(vao2);
gl.bindBuffer(gl.ARRAY_BUFFER, particleDataBuffer2);
gl.bufferData(gl.ARRAY_BUFFER, numParticles * numInputFloats * bytesPerFloat, gl.DYNAMIC_COPY);
var offset = 0;
// position
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, numInputFloats * bytesPerFloat, 0);
offset += bytesPerFloat * 2;
// velocity
gl.vertexAttribPointer(1, 2, gl.FLOAT, false, numInputFloats * bytesPerFloat, offset);
offset += bytesPerFloat * 2
// rotation
gl.vertexAttribPointer(2, 1, gl.FLOAT, false, numInputFloats * bytesPerFloat, offset);
offset += bytesPerFloat * 1
// angularVelocity
gl.vertexAttribPointer(3, 1, gl.FLOAT, false, numInputFloats * bytesPerFloat, offset);
offset += bytesPerFloat * 1

// enable attributes
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);
gl.enableVertexAttribArray(2);
gl.enableVertexAttribArray(3);

vaos.push(vao2);
buffers.push(particleDataBuffer2);

// Clean up
gl.bindVertexArray(null);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

gl.clearColor(0, 0, 0, 1);


// uniforms 
const u_deltaMs = gl.getUniformLocation(program, 'deltaMs');
const u_gravity = gl.getUniformLocation(program, 'gravity');

let index = 0;
let currentVao = vaos[(index) % 2];
let currentBuffer = buffers[(index + 1) % 2];
let lastTime = performance.now();
const draw = (timestamp: number) => {
    requestAnimationFrame(draw);

    const elapsedMs = timestamp - lastTime;
    lastTime = timestamp;

    gl.uniform1f(u_deltaMs, elapsedMs);
    gl.uniform2fv(u_gravity, [0, -.5]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // Bind one buffer to ARRAY_BUFFER and the other to TFB
    gl.bindVertexArray(currentVao);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, currentBuffer);

    // Perform transform feedback and the draw call
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, numParticles);
    gl.endTransformFeedback();

    // Clean up after ourselves to avoid errors.
    gl.bindVertexArray(null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

    // flip flop buffers
    currentVao = vaos[(index) % 2];
    currentBuffer = buffers[(index + 1) % 2];
    index = (index + 1) % 2;
}
draw(performance.now());