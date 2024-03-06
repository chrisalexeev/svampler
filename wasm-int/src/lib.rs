mod utils;

extern crate web_sys;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    log("Hello, wasm-int!");
}

#[wasm_bindgen]
pub fn echo(input: f64) -> f64 {
    input
}


// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub struct MyPlugin {
    gain: f32,
    // queue: Vec<f32>,
}

#[wasm_bindgen]
impl MyPlugin {
    #[wasm_bindgen(constructor)]
    pub fn new(new_gain: f32) -> MyPlugin {
        utils::set_panic_hook();
        // let q = vec![0.0; delay as usize];
        // log!("Delay created with delay: {}", delay);
        MyPlugin { gain: new_gain }
    }

    pub fn process(&self, input: &[f32], output: &mut [f32]) {
        for (i, sample) in input.iter().enumerate() {
            // let delayed_output = self.queue.remove(0);
            // self.queue.push(sample.clone());
            output[i] = self.gain * sample;
        }
    }
}
