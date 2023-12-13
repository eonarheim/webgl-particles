# WebGL Particle System

![particle fire effect 100,000 particles](./particles-webgl.gif)

## TODOs
* [x] world space coords
* [ ] start/end color
* [ ] allow custom shaders?
* [ ] Particles builder page to experiment and get example snippet
* [x] Transform feedback particles for YES particles
* [ ] Events
   - Done emitting?
   - how do you know when you need to reclaim a particle
      - could do a ring buffer with drawarray and shift a window
      - could keep a timer in js so you know the max __possible__ time it could take for particles to age out
      - could periodically poll the gpu buffer and inspect it's contents (probably slow)
      - could use a texture to communicate
* [x] Support arbitrary sprites
* [ ] Support animation?
* [x] Collisions? Perhaps simple masking could work? Like for walls and junk
  - create obstacle textures that can be sampled in the vertex shader
  - probably need a normal map texture to push particles in the right direction if colliding

