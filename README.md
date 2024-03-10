# Svampler 🥁

Svampler is an drum machine/sampler written in Svelte and typescript. [Try the demo!](https://main.d2exlf4lj9rd9.amplifyapp.com/)

## Goal

This started as a way to learn the Web Audio API, Svelte, Rust, and WASM (at the moment there is no Rust or WASM in the main branch).

Currently, I am in the process of redesigning this as a full application, _not just a toy_. The `sampler.ts` implementation will be broken out to be a full, modular, audio routing engine, of which the drum machine will be a single module. Upcoming improvements include synthesizers, effect racks, a mix bus, arranger, and more.

The long-term goal of this app is to be an in-browser production studio, tailored to my personal workflow, that can handle additional DSP via Rust+WASM to create 🔥 _~certified bangers~_ 🔥.

## Setup

Add `.wav` samples to `public/samples`.

Run the setup.
```shell
./gen-env.sh
```

This will generate an `environment.json` in the `public` folder. This is what the sample library uses to know which samples are available.
