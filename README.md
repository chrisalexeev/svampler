# Svampler 🥁

Svampler is an drum machine/sampler written in Svelte and typescript.

## Goal

I am building this to learn the Web Audio API, Svelte, Rust, and WASM. At the moment there is no Rust or WASM.

The long-term goal of this app is to be an in-browser production studio that can handle additional DSP via Rust+WASM.

## Setup

Add `.wav` samples to `public/samples`. In its current state, make sure to include at least three files, one with _"kick"_, one with _"snare"_, and one with _"hihat"_ in the filename.*

_*Drag-and-drop from the library will be included soon._

Run the setup.
```shell
./gen-env.sh
```

This will generate an `environment.json` in the `public` folder. This is what the sample library uses to know which samples are available.

## Features

Each major visual component can be dragged and dropped. For now that's it for frill.