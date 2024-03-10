# Svampler 🥁

Svampler is an drum machine/sampler written in Svelte and typescript. [Try the demo!](https://main.d2exlf4lj9rd9.amplifyapp.com/)

## Goal

I am building this to learn the Web Audio API, Svelte, Rust, and WASM. At the moment there is no Rust or WASM in the main branch.

The long-term goal of this app is to be an in-browser production studio, tailored to my personal workflow, that can handle additional DSP via Rust+WASM.

## Setup

Add `.wav` samples to `public/samples`.

Run the setup.
```shell
./gen-env.sh
```

This will generate an `environment.json` in the `public` folder. This is what the sample library uses to know which samples are available.
