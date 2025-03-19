import { MODELS } from "./models.ts";

export type CommandInput = {
	text?: string;
	tokenCount?: number;
	options: {
		modelId: string;
		batch?: boolean;
	};
};

export type Pricing = {
	modelName: string;
	modelId: string;
	pricing: {
		input: number;
		output: number;
	};
};

export type Result = {
	tokenCount: number;
	pricing: Pricing;
};

export type ModelName = keyof typeof MODELS;
export type ModelId = typeof MODELS[ModelName];
