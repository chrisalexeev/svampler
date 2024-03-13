export interface Effect {
	context: any;
	input: any;
	output: any;
	gain: number;
	constructor(context: any, gain?: number): void;
	connect(destination: any): void;
	disconnect(): void;
	setGain(value: number): void;
}