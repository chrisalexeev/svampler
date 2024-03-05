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
pub struct Delay {
    queue: Vec<f64>,
}

#[wasm_bindgen]
impl Delay {
    #[wasm_bindgen(constructor)]
    pub fn new(delay: f64) -> Delay {
        utils::set_panic_hook();
        let q = vec![0.0; delay as usize];
        log!("Delay created with delay: {}", delay);
        Delay { queue: q }
    }

    #[wasm_bindgen]
    pub fn process(&mut self, input: f64) -> f64 {
        let output = self.queue.remove(0);
        self.queue.push(input);
        output
    }
}
