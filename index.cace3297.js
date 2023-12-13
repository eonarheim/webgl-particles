function t(t){return t&&t.__esModule?t.default:t}var a,e,i=globalThis,r={},s={},n=i.parcelRequire94c2;null==n&&((n=function(t){if(t in r)return r[t].exports;if(t in s){var a=s[t];delete s[t];var e={id:t,exports:{}};return r[t]=e,a.call(e.exports,e,e.exports),e.exports}var i=Error("Cannot find module '"+t+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(t,a){s[t]=a},i.parcelRequire94c2=n),(0,n.register)("27Lyk",function(t,a){Object.defineProperty(t.exports,"register",{get:()=>e,set:t=>e=t,enumerable:!0,configurable:!0});var e,i=new Map;e=function(t,a){for(var e=0;e<a.length-1;e+=2)i.set(a[e],{baseUrl:t,path:a[e+1]})}}),n("27Lyk").register(new URL("",import.meta.url).toString(),JSON.parse('["lWpsB","index.cace3297.js","ghyAv","sprite.7cf94011.png","cfGOW","obstacle.af1de7c7.png"]'));class o{static get Zero(){return new o(0,0)}static get One(){return new o(1,1)}static get Half(){return new o(.5,.5)}static get Up(){return new o(0,-1)}static get Down(){return new o(0,1)}static get Left(){return new o(-1,0)}static get Right(){return new o(1,0)}static fromAngle(t){return new o(Math.cos(t),Math.sin(t))}static isValid(t){return!(null==t||isNaN(t.x)||isNaN(t.y))&&t.x!==1/0&&t.y!==1/0&&t.x!==-1/0&&t.y!==-1/0}static distance(t,a){return Math.sqrt(Math.pow(t.x-a.x,2)+Math.pow(t.y-a.y,2))}static min(t,a){return new o(Math.min(t.x,a.x),Math.min(t.y,a.y))}static max(t,a){return new o(Math.max(t.x,a.x),Math.max(t.y,a.y))}constructor(t,a){this._x=0,this._y=0,this._x=t,this._y=a}get x(){return this._x}set x(t){this._x=t}get y(){return this._y}set y(t){this._y=t}setTo(t,a){this.x=t,this.y=a}equals(t,a=.001){return Math.abs(this.x-t.x)<=a&&Math.abs(this.y-t.y)<=a}distance(t){if(!t)return Math.sqrt(this.x*this.x+this.y*this.y);let a=this.x-t.x,e=this.y-t.y;return Math.sqrt(a*a+e*e)}squareDistance(t){t||(t=o.Zero);let a=this.x-t.x,e=this.y-t.y;return a*a+e*e}get size(){return this.distance()}set size(t){let a=this.normalize().scale(t);this.setTo(a.x,a.y)}normalize(){let t=this.distance();return t>0?new o(this.x/t,this.y/t):new o(0,1)}average(t){return this.add(t).scale(.5)}scale(t,a){let e=a||new o(0,0);return t instanceof o?(e.x=this.x*t.x,e.y=this.y*t.y):(e.x=this.x*t,e.y=this.y*t),e}add(t,a){return a?(a.x=this.x+t.x,a.y=this.y+t.y,a):new o(this.x+t.x,this.y+t.y)}sub(t){return new o(this.x-t.x,this.y-t.y)}addEqual(t){return this.setTo(this.x+t.x,this.y+t.y),this}subEqual(t){return this.setTo(this.x-t.x,this.y-t.y),this}scaleEqual(t){return this.setTo(this.x*t,this.y*t),this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return t instanceof o?this.x*t.y-this.y*t.x:"number"==typeof t?new o(t*this.y,-t*this.x):void 0}static cross(t,a){return new o(-t*a.y,t*a.x)}perpendicular(){return new o(this.y,-this.x)}normal(){return this.perpendicular().normalize()}negate(){return this.scale(-1)}toAngle(){return Math.atan2(this.y,this.x)}rotate(t,a){a||(a=new o(0,0));let e=Math.sin(t),i=Math.cos(t);return new o(i*(this.x-a.x)-e*(this.y-a.y)+a.x,e*(this.x-a.x)+i*(this.y-a.y)+a.y)}clone(t){let a=t??new o(0,0);return a.x=this.x,a.y=this.y,a}toString(t){return t?`(${this.x.toFixed(t)}, ${this.y.toFixed(t)})`:`(${this.x}, ${this.y})`}}function d(t,a){return new o(t,a)}const l=2*Math.PI;function h(t){return 0===t?0:t<0?-1:1}(a=e||(e={}))[a.X=12]="X",a[a.Y=13]="Y";class c{static ortho(t,a,e,i,r,s){let n=new c;return n.data[0]=2/(a-t),n.data[1]=0,n.data[2]=0,n.data[3]=0,n.data[4]=0,n.data[5]=2/(i-e),n.data[6]=0,n.data[7]=0,n.data[8]=0,n.data[9]=0,n.data[10]=-2/(s-r),n.data[11]=0,n.data[12]=-(a+t)/(a-t),n.data[13]=-(i+e)/(i-e),n.data[14]=-(s+r)/(s-r),n.data[15]=1,n}clone(t){let a=t||new c;return a.data[0]=this.data[0],a.data[1]=this.data[1],a.data[2]=this.data[2],a.data[3]=this.data[3],a.data[4]=this.data[4],a.data[5]=this.data[5],a.data[6]=this.data[6],a.data[7]=this.data[7],a.data[8]=this.data[8],a.data[9]=this.data[9],a.data[10]=this.data[10],a.data[11]=this.data[11],a.data[12]=this.data[12],a.data[13]=this.data[13],a.data[14]=this.data[14],a.data[15]=this.data[15],a}toDOMMatrix(){return new DOMMatrix([...this.data])}static fromFloat32Array(t){let a=new c;return a.data=t,a}static identity(){let t=new c;return t.data[0]=1,t.data[1]=0,t.data[2]=0,t.data[3]=0,t.data[4]=0,t.data[5]=1,t.data[6]=0,t.data[7]=0,t.data[8]=0,t.data[9]=0,t.data[10]=1,t.data[11]=0,t.data[12]=0,t.data[13]=0,t.data[14]=0,t.data[15]=1,t}reset(){return this.data[0]=1,this.data[1]=0,this.data[2]=0,this.data[3]=0,this.data[4]=0,this.data[5]=1,this.data[6]=0,this.data[7]=0,this.data[8]=0,this.data[9]=0,this.data[10]=1,this.data[11]=0,this.data[12]=0,this.data[13]=0,this.data[14]=0,this.data[15]=1,this}static translation(t,a){let e=c.identity();return e.data[12]=t,e.data[13]=a,e}static scale(t,a){let e=c.identity();return e.data[0]=t,e.data[5]=a,e.data[10]=1,e.data[15]=1,e}static rotation(t){let a=c.identity();return a.data[0]=Math.cos(t),a.data[4]=-Math.sin(t),a.data[1]=Math.sin(t),a.data[5]=Math.cos(t),a}multiply(t,a){if(t instanceof o){let e=a||new o(0,0),i=t.x*this.data[0]+t.y*this.data[4]+this.data[12],r=t.x*this.data[1]+t.y*this.data[5]+this.data[13];return e.x=i,e.y=r,e}{let e=a||new c,i=this.data[0],r=this.data[1],s=this.data[2],n=this.data[3],o=this.data[4],d=this.data[5],l=this.data[6],u=this.data[7],f=this.data[8],x=this.data[9],y=this.data[10],m=this.data[11],g=this.data[12],_=this.data[13],T=this.data[14],E=this.data[15],A=t.data[0],R=t.data[1],p=t.data[2],b=t.data[3],v=t.data[4],S=t.data[5],P=t.data[6],M=t.data[7],w=t.data[8],U=t.data[9],F=t.data[10],L=t.data[11],D=t.data[12],X=t.data[13],O=t.data[14],V=t.data[15];e.data[0]=i*A+o*R+f*p+g*b,e.data[1]=r*A+d*R+x*p+_*b,e.data[2]=s*A+l*R+y*p+T*b,e.data[3]=n*A+u*R+m*p+E*b,e.data[4]=i*v+o*S+f*P+g*M,e.data[5]=r*v+d*S+x*P+_*M,e.data[6]=s*v+l*S+y*P+T*M,e.data[7]=n*v+u*S+m*P+E*M,e.data[8]=i*w+o*U+f*F+g*L,e.data[9]=r*w+d*U+x*F+_*L,e.data[10]=s*w+l*U+y*F+T*L,e.data[11]=n*w+u*U+m*F+E*L,e.data[12]=i*D+o*X+f*O+g*V,e.data[13]=r*D+d*X+x*O+_*V,e.data[14]=s*D+l*X+y*O+T*V,e.data[15]=n*D+u*X+m*O+E*V;let B=this.getScale();return e._scaleSignX=h(B.x)*h(e._scaleSignX),e._scaleSignY=h(B.y)*h(e._scaleSignY),e}}translate(t,a){let e=this.data[0],i=this.data[1],r=this.data[2],s=this.data[3],n=this.data[4],o=this.data[5],d=this.data[6],l=this.data[7],h=this.data[8],c=this.data[9],u=this.data[10],f=this.data[11],x=this.data[12],y=this.data[13],m=this.data[14],g=this.data[15];return this.data[12]=e*t+n*a+0*h+1*x,this.data[13]=i*t+o*a+0*c+1*y,this.data[14]=r*t+d*a+0*u+1*m,this.data[15]=s*t+l*a+0*f+1*g,this}setPosition(t,a){this.data[12]=t,this.data[13]=a}getPosition(){return d(this.data[12],this.data[13])}rotate(t){let a=this.data[0],e=this.data[1],i=this.data[2],r=this.data[3],s=this.data[4],n=this.data[5],o=this.data[6],d=this.data[7],l=Math.sin(t),h=Math.cos(t);return this.data[0]=h*a+l*s,this.data[1]=h*e+l*n,this.data[2]=h*i+l*o,this.data[3]=h*r+l*d,this.data[4]=h*s-l*a,this.data[5]=h*n-l*e,this.data[6]=h*o-l*i,this.data[7]=h*d-l*r,this}scale(t,a){let e=this.data[0],i=this.data[1],r=this.data[2],s=this.data[3],n=this.data[4],o=this.data[5],d=this.data[6],l=this.data[7];return this.data[0]=e*t,this.data[1]=i*t,this.data[2]=r*t,this.data[3]=s*t,this.data[4]=n*a,this.data[5]=o*a,this.data[6]=d*a,this.data[7]=l*a,this}setRotation(t){let a=this.getScale(),e=Math.sin(t),i=Math.cos(t);this.data[0]=i*a.x,this.data[1]=e*a.y,this.data[4]=-e*a.x,this.data[5]=i*a.y}getRotation(){return function(t){let a=t;if(t>l)for(;a>l;)a-=l;if(t<0)for(;a<0;)a+=l;return a}(Math.atan2(this.data[1]/this.getScaleY(),this.data[0]/this.getScaleX()))}getScaleX(){let t=d(this.data[0],this.data[4]).size;return this._scaleSignX*t}getScaleY(){let t=d(this.data[1],this.data[5]).size;return this._scaleSignY*t}getScale(){return d(this.getScaleX(),this.getScaleY())}setScaleX(t){if(this._scaleX===t)return;this._scaleSignX=h(t);let a=d(this.data[0]*this._scaleSignX,this.data[4]*this._scaleSignX).normalize();this.data[0]=a.x*t,this.data[4]=a.y*t,this._scaleX=t}setScaleY(t){if(this._scaleY===t)return;this._scaleSignY=h(t);let a=d(this.data[1]*this._scaleSignY,this.data[5]*this._scaleSignY).normalize();this.data[1]=a.x*t,this.data[5]=a.y*t,this._scaleY=t}setScale(t){this.setScaleX(t.x),this.setScaleY(t.y)}getBasisDeterminant(){return this.data[0]*this.data[5]-this.data[1]*this.data[4]}getAffineInverse(t){let a=1/this.getBasisDeterminant(),e=this.data[0],i=this.data[4],r=this.data[1],s=this.data[5],n=t||c.identity();n.data[0]=s*a,n.data[1]=-r*a,n.data[4]=-i*a,n.data[5]=e*a;let o=this.data[12],d=this.data[13];return n.data[12]=-(o*n.data[0]+d*n.data[4]),n.data[13]=-(o*n.data[1]+d*n.data[5]),n}isIdentity(){return 1===this.data[0]&&0===this.data[1]&&0===this.data[2]&&0===this.data[3]&&0===this.data[4]&&1===this.data[5]&&0===this.data[6]&&0===this.data[7]&&0===this.data[8]&&0===this.data[9]&&1===this.data[10]&&0===this.data[11]&&0===this.data[12]&&0===this.data[13]&&0===this.data[14]&&1===this.data[15]}toString(){return`
[${this.data[0]} ${this.data[4]} ${this.data[8]} ${this.data[12]}]
[${this.data[1]} ${this.data[5]} ${this.data[9]} ${this.data[13]}]
[${this.data[2]} ${this.data[6]} ${this.data[10]} ${this.data[14]}]
[${this.data[3]} ${this.data[7]} ${this.data[11]} ${this.data[15]}]
`}constructor(){this.data=new Float32Array(16),this._scaleX=1,this._scaleSignX=1,this._scaleY=1,this._scaleSignY=1}}var u={};u=new URL("sprite.7cf94011.png",import.meta.url).toString();var f={};f=new URL("obstacle.af1de7c7.png",import.meta.url).toString();const x=document.querySelector("canvas").getContext("webgl2",{antialias:!1,premultipliedAlpha:!1,alpha:!1,depth:!0,powerPreference:"high-performance"});function y(t,a){if(!t)return a;let e=t.split("\n"),i=a.search(/\d:\d/),r=a.indexOf(" ",i),[s,n]=a.slice(i,r).split(":").map(t=>Number(t));for(let t=0;t<e.length;t++)e[t]=`${t+1}: ${e[t]}${n===t+1?" <----- ERROR!":""}`;return"\n\nSource:\n"+e.join("\n")}const m=c.ortho(0,x.canvas.width,x.canvas.height,0,400,-400);x.viewport(0,0,x.canvas.width,x.canvas.height),x.clearColor(0,0,0,1),x.clear(x.COLOR_BUFFER_BIT),x.enable(x.BLEND),x.blendFunc(x.ONE,x.ONE_MINUS_SRC_ALPHA);const g=t=>t[0],_=g`#version 300 es

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

    float ran_range(float ran, float minf, float maxf) {
        return ran * (maxf - minf) + minf;
    }

    uniform float uRandom;
    uniform float deltaMs;
    uniform vec2 gravity;
    uniform mat4 u_matrix;

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
            // vec2 samplePoint = ((finalPosition + 1.) / 2.);
            vec2 samplePoint = finalPosition / vec2(width, height);

            vec4 collides = texture(obstacle, samplePoint);
            if (distance(collides, vec4(0.)) > .01) {
                // non opaque means we collide! recalc final pos/vel
                // vec2 normal = normalize(position - finalPosition); // guess the collision normal is the opposite direction
                vec2 newVelocity =  velocity * -.1; // lose energy
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

            finalVelocity = vec2(ran_range(r1, -200., 200.), ran_range(r2, 0., -200.));
            finalPosition = vec2(ran_range(r2, 0., 800.), 800.);
            finalRotation = 3.14 * 2. * r3;
            finalAngularVelocity = 6. * r2 - 3.14;
            finalLifeMs = 2000. * r3;
        }
        float perc = finalLifeMs / 2000.;
        vec2 transformedPos = (u_matrix * vec4(finalPosition, 0., 1.)).xy;
        gl_Position = vec4(transformedPos, 0.0, 1.0);
        gl_PointSize = 32.;//10.;// 64.0 * perc;
    }
`,T=g`#version 300 es
    precision mediump float;

    uniform sampler2D graphic;

    in float finalRotation;
    in float finalLifeMs;
    out vec4 fragColor;

    void main() {

        float alpha = finalLifeMs/2000.;

        /** Draw texture */
        float mid = .5;
        float cosine = cos(finalRotation);
        float sine = sin(finalRotation);
        vec2 rotated = vec2(cosine * (gl_PointCoord.x - mid) + sine * (gl_PointCoord.y - mid) + mid,
                            cosine * (gl_PointCoord.y - mid) - sine * (gl_PointCoord.x - mid) + mid);
        vec4 color = texture(graphic, rotated);
        fragColor = color * alpha;

        /** Draw circle */
        // float distanceFromPointCenter = distance(gl_PointCoord.xy, vec2(0.5));
        // if (distanceFromPointCenter > .5) discard;
        // // TODO particle colors as vertex attributes
        // fragColor = vec4(.8, .9*alpha, .1, 1.) * alpha;
    }
`,E=x.createProgram(),A=x.createShader(x.VERTEX_SHADER);x.shaderSource(A,_),x.compileShader(A);var R=x.getShaderParameter(A,x.COMPILE_STATUS);if(!R){let t=x.getShaderInfoLog(A);throw Error(`Could not compile vertex shader:

${t}${y(_,t)}`)}x.attachShader(E,A);const p=x.createShader(x.FRAGMENT_SHADER);x.shaderSource(p,T),x.compileShader(p);var R=x.getShaderParameter(p,x.COMPILE_STATUS);if(!R){let t=x.getShaderInfoLog(p);throw Error(`Could not compile frag shader:

${t}${y(T,t)}`)}x.attachShader(E,p),x.transformFeedbackVaryings(E,["finalPosition","finalVelocity","finalRotation","finalAngularVelocity","finalLifeMs"],x.INTERLEAVED_ATTRIBS),x.linkProgram(E),x.getProgramParameter(E,x.LINK_STATUS)||(console.log(x.getShaderInfoLog(A)),console.log(x.getShaderInfoLog(p))),x.useProgram(E);const b=2*Math.PI,v=new Float32Array(7e5);for(let t=0;t<7e5;t+=7)v.set([800*Math.random(),800*Math.random(),200*Math.random()-100,200*Math.random()-100,Math.random()*b,2.5*Math.random(),2e3*Math.random()],t);let S=[],P=[];const M=x.createBuffer(),w=x.createVertexArray();x.bindVertexArray(w),x.bindBuffer(x.ARRAY_BUFFER,M),x.bufferData(x.ARRAY_BUFFER,28e5,x.DYNAMIC_COPY),x.bufferSubData(x.ARRAY_BUFFER,0,v);var U=0;x.vertexAttribPointer(0,2,x.FLOAT,!1,28,0),U+=8,x.vertexAttribPointer(1,2,x.FLOAT,!1,28,U),U+=8,x.vertexAttribPointer(2,1,x.FLOAT,!1,28,U),U+=4,x.vertexAttribPointer(3,1,x.FLOAT,!1,28,U),U+=4,x.vertexAttribPointer(4,1,x.FLOAT,!1,28,U),U+=4,x.enableVertexAttribArray(0),x.enableVertexAttribArray(1),x.enableVertexAttribArray(2),x.enableVertexAttribArray(3),x.enableVertexAttribArray(4),S.push(w),P.push(M),x.bindVertexArray(null),x.bindBuffer(x.ARRAY_BUFFER,null);const F=x.createBuffer(),L=x.createVertexArray();x.bindVertexArray(L),x.bindBuffer(x.ARRAY_BUFFER,F),x.bufferData(x.ARRAY_BUFFER,28e5,x.DYNAMIC_COPY);var U=0;x.vertexAttribPointer(0,2,x.FLOAT,!1,28,0),U+=8,x.vertexAttribPointer(1,2,x.FLOAT,!1,28,U),U+=8,x.vertexAttribPointer(2,1,x.FLOAT,!1,28,U),U+=4,x.vertexAttribPointer(3,1,x.FLOAT,!1,28,U),U+=4,x.vertexAttribPointer(4,1,x.FLOAT,!1,28,U),U+=4,x.enableVertexAttribArray(0),x.enableVertexAttribArray(1),x.enableVertexAttribArray(2),x.enableVertexAttribArray(3),x.enableVertexAttribArray(4),S.push(L),P.push(F),x.bindVertexArray(null),x.bindBuffer(x.ARRAY_BUFFER,null);const D=x.getUniformLocation(E,"u_matrix"),X=x.getUniformLocation(E,"uRandom"),O=x.getUniformLocation(E,"deltaMs"),V=x.getUniformLocation(E,"gravity"),B=x.getUniformLocation(E,"graphic"),I=x.getUniformLocation(E,"obstacle"),N=x.createTexture();x.bindTexture(x.TEXTURE_2D,N),x.pixelStorei(x.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_WRAP_S,x.CLAMP_TO_EDGE),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_WRAP_T,x.CLAMP_TO_EDGE),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_MIN_FILTER,x.NEAREST),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_MAG_FILTER,x.NEAREST);const C=new Image;C.onload=()=>{x.activeTexture(x.TEXTURE0),x.bindTexture(x.TEXTURE_2D,N),x.texImage2D(x.TEXTURE_2D,0,x.RGBA,x.RGBA,x.UNSIGNED_BYTE,C),x.bindTexture(x.TEXTURE_2D,null)},C.src=t(u);const Y=x.createTexture(),$=new Image;x.bindTexture(x.TEXTURE_2D,Y),x.pixelStorei(x.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_WRAP_S,x.CLAMP_TO_EDGE),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_WRAP_T,x.CLAMP_TO_EDGE),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_MIN_FILTER,x.NEAREST),x.texParameteri(x.TEXTURE_2D,x.TEXTURE_MAG_FILTER,x.NEAREST),$.onload=()=>{x.activeTexture(x.TEXTURE0+1),x.bindTexture(x.TEXTURE_2D,Y),x.texImage2D(x.TEXTURE_2D,0,x.RGBA,x.RGBA,x.UNSIGNED_BYTE,$)},$.src=t(f);let H=100;const q=document.querySelector("#num-particles");q.innerText=H.toString();const G=document.querySelector("#particles");G.value=H.toString(),G.addEventListener("change",t=>{H=+t?.target.value,q.innerText=H.toString()});let z=0,k=S[0],W=P[(z+1)%2],K=0;const j=t=>{requestAnimationFrame(j);let a=t-K;K=t,a<=0&&(a=1),x.uniformMatrix4fv(D,!1,m.data),x.uniform1f(X,Math.random()),x.uniform1f(O,a),x.uniform2fv(V,[0,-100]),x.activeTexture(x.TEXTURE0),x.bindTexture(x.TEXTURE_2D,N),x.uniform1i(B,0),x.activeTexture(x.TEXTURE0+1),x.bindTexture(x.TEXTURE_2D,Y),x.uniform1i(I,1),x.clearColor(0,0,0,1),x.clear(x.COLOR_BUFFER_BIT),x.bindVertexArray(k),x.bindBufferBase(x.TRANSFORM_FEEDBACK_BUFFER,0,W),x.beginTransformFeedback(x.POINTS),x.drawArrays(x.POINTS,0,H),x.endTransformFeedback(),x.bindVertexArray(null),x.bindBufferBase(x.TRANSFORM_FEEDBACK_BUFFER,0,null),k=S[z%2],W=P[(z+1)%2],z=(z+1)%2};j(performance.now());
//# sourceMappingURL=index.cace3297.js.map
