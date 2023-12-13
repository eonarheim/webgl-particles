// import { Matrix } from "./matrix";
import spriteImage from './sprite.png'
import obstacleImage from './obstacle.png';

const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);
const gl = canvas.getContext('webgl2',
    {
        antialias: false,
        premultipliedAlpha: false,
        alpha: false,
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
gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
// gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
// gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);


// create shader programs
const glsl = (x: any) => x[0];
const particleVertex = glsl`#version 300 es

    /* From TheBookOfShaders, chapter 10. This is a slightly upscaled implementation
    of the algorithm:
        r = Math.cos(aReallyHugeNumber);
    except it attempts to avoid the concentration of values around 1 and 0 by 
    multiplying by a very large irrational number and then discarding the result's
    integer component. Acceptable results. Other deterministic pseudo-random number 
    algorithms are available (including random textures).
    */
    float rand2(vec2 source)
    {
        return fract(sin(dot(source.xy, vec2(1.9898,1.2313))) * 42758.5453123);
    } 

    uniform float uRandom;
    uniform float deltaMs;
    uniform vec2 gravity;

    uniform sampler2D obstacle;

    layout(location=0) in vec2 position;
    layout(location=1) in vec2 velocity;
    layout(location=2) in float rotation;
    layout(location=3) in float angularVelocity;
    layout(location=4) in float lifeMs;

    out vec2 finalPosition;
    out vec2 finalVelocity;
    out float finalRotation;
    out float finalAngularVelocity;
    out float finalLifeMs;
    void main() {

        float width = 800.;
        float height = 800.;

        if (lifeMs >= 0.) {
            float seconds = deltaMs / 1000.0;
            // euler integration
            finalVelocity = velocity + gravity * seconds;
            finalPosition = position + velocity * seconds + gravity * .5 * seconds * seconds;
            finalRotation = rotation + angularVelocity * seconds;
            finalAngularVelocity = angularVelocity; // todo weird artifact of re-using the same buffer layout for update/draw
            finalLifeMs = lifeMs - deltaMs;


            // try distance to center?
            // if (distance(finalPosition, vec2(0.)) < .5) {
            //     // non opaque means we collide! recalc final pos/vel
            //     // vec2 normal = normalize(position - finalPosition); // guess the collision normal is the opposite direction
            //     vec2 newVelocity =  velocity * -1.; //reflect(velocity, normal) * 1.1;
            //     finalVelocity = newVelocity + gravity * seconds;
            //     finalPosition = position + newVelocity * seconds + gravity * .5 * seconds * seconds;
            // }

            // sample obstacle mask texture to see if we collide
            // clip space to obstacle tex coords
            vec2 samplePoint = ((finalPosition + 1.) / 2.);

            vec4 collides = texture(obstacle, samplePoint);
            if (distance(collides, vec4(0.)) > .01) {
                // non opaque means we collide! recalc final pos/vel
                // vec2 normal = normalize(position - finalPosition); // guess the collision normal is the opposite direction
                vec2 newVelocity =  velocity * -1.; //reflect(velocity, normal) * 1.1;
                finalVelocity = newVelocity + gravity * seconds;
                finalPosition = position + newVelocity * seconds + gravity * .5 * seconds * seconds;
            }

        } else {
            // Reset particle!

            // Seed some randoms
            float s  = float(gl_VertexID);
            float r1 = rand2(vec2(s, uRandom));
            float r2 = rand2(vec2(r1, uRandom));
            float r3 = rand2(vec2(uRandom, r1 * uRandom));

            finalVelocity = vec2(r3 * 2. - 1.5, 1.5 * r1);
            finalPosition = vec2(r2 * 2. - 1., -1);
            finalRotation = 3.14 * 2. * r3;
            finalAngularVelocity = 6. * r2 - 3.14;
            finalLifeMs = 2000. * r3;
        }
        float perc = finalLifeMs / 2000.;
        gl_Position = vec4(finalPosition, 0.0, 1.0);
        gl_PointSize = 10.;// 64.0 * perc;
    }
`
const particleFrag = glsl`#version 300 es
    precision mediump float;

    uniform sampler2D graphic;

    in float finalRotation;
    in float finalLifeMs;
    out vec4 fragColor;

    void main() {

        float alpha = finalLifeMs/2000.;

        /** Draw texture */
        // float mid = .5;
        // float cosine = cos(finalRotation);
        // float sine = sin(finalRotation);
        // vec2 rotated = vec2(cosine * (gl_PointCoord.x - mid) + sine * (gl_PointCoord.y - mid) + mid,
        //                     cosine * (gl_PointCoord.y - mid) - sine * (gl_PointCoord.x - mid) + mid);
        // vec4 color = texture(graphic, rotated);
        // fragColor = color * alpha;

        /** Draw circle */
        float distanceFromPointCenter = distance(gl_PointCoord.xy, vec2(0.5));
        if (distanceFromPointCenter > .5) discard;
        // TODO particle colors as vertex attributes
        fragColor = vec4(.8, .9*alpha, .1, 1.) * alpha;
    }
`

// Init program
const program = gl.createProgram()!;
const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
gl.shaderSource(vertexShader, particleVertex);
gl.compileShader(vertexShader);
var success = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
if (!success) {
  const errorInfo = gl.getShaderInfoLog(vertexShader);
  throw Error(`Could not compile vertex shader:\n\n${errorInfo}${_processSourceForError(particleVertex, errorInfo!)}`);
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

gl.transformFeedbackVaryings(program, ['finalPosition', 'finalVelocity', 'finalRotation', 'finalAngularVelocity', 'finalLifeMs'], gl.INTERLEAVED_ATTRIBS);
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
const TwoPI = Math.PI * 2;
const numParticles = 100_000;
const numInputFloats = 2 + 2 + 1 + 1 + 1;
const particleData = new Float32Array(numParticles * numInputFloats);
const bytesPerFloat = 4;
for (let i = 0; i < numParticles * numInputFloats; i += numInputFloats) {
    particleData.set([
        Math.random()*2-1, Math.random()*2-1, // pos in clipspace
        Math.random(), Math.random(),                        // velocity
        Math.random() * TwoPI,                            // rotation
        Math.random() * 2.5,                             // angular velocity
        Math.random()*2000 // life
    ], i);
}

const getBufferContents = (buffer: WebGLBuffer) => {
    // Consider this `sync` object as a flag. It will be dropped
    // into WebGL's instruction pipeline. When WebGL reaches
    // this sync object, it will set its status two one of FOUR
    // values.
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)!;

    const checkStatus = () => {
        // Get the status
        const status = gl.clientWaitSync(sync, gl.SYNC_FLUSH_COMMANDS_BIT, 0);

        if (status === gl.TIMEOUT_EXPIRED) {
            console.log('GPU is still busy. Let\'s wait some more.');
            setTimeout(checkStatus);
        } else if (status === gl.WAIT_FAILED) {
            console.error('Something bad happened and we won\'t get any response.');
        } else  {
            // This code will be reached if the status is either
            // CONDITION_SATISFIED or SIGNALED_ALREADY. We don't 
            // really care which status it is as long as one of
            // these was found. So we can safely read the buffer data
            // (assuming another draw call hasn't initiated more
            // changes....)
            const view = new Float32Array(numParticles * numInputFloats);
            gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, buffer);
            gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, view);
            gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
            console.log(view);
        }
    };

    setTimeout(checkStatus);
};


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
// life
gl.vertexAttribPointer(4, 1, gl.FLOAT, false, numInputFloats * bytesPerFloat, offset);
offset += bytesPerFloat * 1

// enable attributes
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);
gl.enableVertexAttribArray(2);
gl.enableVertexAttribArray(3);
gl.enableVertexAttribArray(4);

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
// life
gl.vertexAttribPointer(4, 1, gl.FLOAT, false, numInputFloats * bytesPerFloat, offset);
offset += bytesPerFloat * 1

// enable attributes
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);
gl.enableVertexAttribArray(2);
gl.enableVertexAttribArray(3);
gl.enableVertexAttribArray(4);

vaos.push(vao2);
buffers.push(particleDataBuffer2);

// Clean up
gl.bindVertexArray(null);
gl.bindBuffer(gl.ARRAY_BUFFER, null);


// uniforms
const u_random = gl.getUniformLocation(program, 'uRandom');
const u_deltaMs = gl.getUniformLocation(program, 'deltaMs');
const u_gravity = gl.getUniformLocation(program, 'gravity');
const u_graphic = gl.getUniformLocation(program, 'graphic');
const u_obstacle = gl.getUniformLocation(program, 'obstacle');

const spriteTex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, spriteTex);
gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
const sprite = new Image();
sprite.onload = () => {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, spriteTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sprite);
    gl.bindTexture(gl.TEXTURE_2D, null);
}
sprite.src = spriteImage;

const obstacleTex = gl.createTexture();
const obstacle = new Image();
gl.bindTexture(gl.TEXTURE_2D, obstacleTex);
gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
obstacle.onload = () => {
    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, obstacleTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, obstacle);
    // gl.bindTexture(gl.TEXTURE_2D, null);
}
obstacle.src = obstacleImage;


let index = 0;
let currentVao = vaos[(index) % 2];
let currentBuffer = buffers[(index + 1) % 2];
let lastTime = 0;
const draw = (timestamp: number) => {
    requestAnimationFrame(draw);

    let elapsedMs = timestamp - lastTime;
    lastTime = timestamp;
    if (elapsedMs <= 0) {
        elapsedMs = 1;
    }
    // console.log(elapsedMs);

    gl.uniform1f(u_random, Math.random());
    gl.uniform1f(u_deltaMs, elapsedMs);
    gl.uniform2fv(u_gravity, [0, -.5]);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, spriteTex);
    gl.uniform1i(u_graphic, 0);

    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, obstacleTex);
    gl.uniform1i(u_obstacle, 1);

    gl.clearColor(0, 0, 0, 1.0);
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