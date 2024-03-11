// import { Effect, Filter, Noise, Sample } from "./effects/effect";

// var OfflineAudioContext = window.OfflineAudioContext;
// class SimpleReverb extends Effect {
//   declare effect: ConvolverNode;
//   reverbTime: number = 0;
//   attack: number = 0;
//   decay: number = 0;
//   release: number = 0;
//   wet: GainNode | null = null;

//   constructor(context: AudioContext) {
//     super(context);
//     this.name = "SimpleReverb";
//   }

//   setup(reverbTime = 1) {
//     this.effect = this.context.createConvolver();

//     this.reverbTime = reverbTime;

//     this.attack = 0.0001;
//     this.decay = 0.1;
//     this.release = reverbTime;

//     this.wet = this.context.createGain();
//     this.input.connect(this.wet);
//     this.wet?.connect(this.effect!);
//     this.effect?.connect(this.output);

//     this.renderTail();
//   }

//   renderTail() {
//     console.log("renderTail")
//     const tailContext = new OfflineAudioContext(2, this.context.sampleRate * this.reverbTime, this.context.sampleRate);
//     tailContext.oncomplete = (buffer) => {
//       this.effect.buffer = buffer.renderedBuffer;
//     }

//     const tailOsc = new Noise(tailContext, 1);
//     tailOsc.init();
//     tailOsc.connect(tailContext.destination);
//     tailOsc.attack = this.attack;
//     tailOsc.decay = this.decay;
//     tailOsc.release = this.release;


//     tailOsc.on({ frequency: 500, velocity: 1 });
//     tailContext.startRendering();
//     setTimeout(() => {
//       tailOsc.off();
//     }, 1);


//   }

//   set decayTime(value: number) {
//     let dc = value / 3;
//     this.reverbTime = value;
//     this.release = dc;
//     // return this.renderTail();
//   }

// }

// export class AdvancedReverb extends SimpleReverb {
//   preDelay: DelayNode | undefined;
//   multitap: any | undefined;
//   multitapGain: GainNode | undefined;

//   constructor(context: AudioContext) {
//     super(context);
//     this.name = "AdvancedReverb";
//   }

//   setup(reverbTime = 1, preDelay = 0.03) {
//     this.effect = this.context.createConvolver();

//     this.reverbTime = reverbTime;

//     this.attack = 0.0001;
//     this.decay = 0.1;
//     this.release = reverbTime / 3;

//     this.preDelay = this.context.createDelay(reverbTime);
//     this.preDelay!.delayTime.setValueAtTime(preDelay, this.context.currentTime);

//     this.multitap = [];

//     for (let i = 2; i > 0; i--) {
//       this.multitap.push(this.context.createDelay(reverbTime));
//     }
//     this.multitap.map((t: { connect: (arg0: any) => void; delayTime: { setValueAtTime: (arg0: number, arg1: any) => void; }; }, i: number) => {
//       if (this.multitap![i + 1]) {
//         t.connect(this.multitap![i + 1])
//       }
//       t.delayTime.setValueAtTime(0.001 + (i * (preDelay / 2)), this.context.currentTime);
//     })

//     this.multitapGain = this.context.createGain();
//     this.multitap[this.multitap.length - 1].connect(this.multitapGain);

//     this.multitapGain!.gain.value = 0.2;

//     this.multitapGain!.connect(this.output);

//     this.wet = this.context.createGain();

//     this.input.connect(this.wet);
//     this.wet!.connect(this.preDelay!);
//     this.wet!.connect(this.multitap[0]);
//     this.preDelay!.connect(this.effect);
//     this.effect.connect(this.output);

//   }
//   renderTail() {

//     const tailContext = new OfflineAudioContext(2, this.context.sampleRate * this.reverbTime, this.context.sampleRate);
//     tailContext.oncomplete = (buffer) => {
//       this.effect.buffer = buffer.renderedBuffer;
//     }
//     const tailOsc = new Noise(tailContext, 1);
//     const tailLPFilter = new Filter(tailContext, "lowpass", 5000, 1);
//     const tailHPFilter = new Filter(tailContext, "highpass", 500, 1);

//     tailOsc.init();
//     tailOsc.connect(tailHPFilter.input);
//     tailHPFilter.connect(tailLPFilter.input);
//     tailLPFilter.connect(tailContext.destination);
//     tailOsc.attack = this.attack;
//     tailOsc.decay = this.decay;
//     tailOsc.release = this.release;

//     tailContext.startRendering()

//     tailOsc.on({ frequency: 500, velocity: 1 });
//     setTimeout(() => {
//       tailOsc.off();
//     }, 1)
//   }

//   set decayTime(value: number) {
//     let dc = value / 3;
//     this.reverbTime = value;
//     this.release = dc;
//     this.renderTail();
//   }
// }


// // let Audio = new (window.AudioContext)();

// // let filter = new Filter(Audio, "lowpass", 50000, 0.8);
// // filter.setup();
// // let verb = new SimpleReverb(Audio);
// // verb.decayTime = 0.8;
// // verb.wet!.gain.value = 2;


// // let compressor = Audio.createDynamicsCompressor();
// // compressor.threshold.setValueAtTime(-24, Audio.currentTime);
// // compressor.knee.setValueAtTime(40, Audio.currentTime);
// // compressor.ratio.setValueAtTime(12, Audio.currentTime);
// // compressor.attack.setValueAtTime(0, Audio.currentTime);
// // compressor.release.setValueAtTime(0.25, Audio.currentTime);
// // compressor.connect(Audio.destination);

// // filter.connect(verb.input);
// // verb.connect(compressor);