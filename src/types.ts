/**
 * @module types
 * @description Type definitions for the Bedrock Abacus library
 */

import { MODELS } from "./models.ts";

/**
 * Input configuration for pricing calculations
 *
 * @typedef {Object} CommandInput
 * @property {string} [text] - The input text to calculate tokens and pricing for
 * @property {number} [tokenCount] - Direct token count (if already known)
 * @property {Object} options - Model configuration options
 * @property {string} options.modelId - The ID of the model to use for pricing
 * @property {boolean} [options.batch] - Whether to use batch pricing (cheaper rates)
 */
export type CommandInput = {
	text?: string;
	tokenCount?: number;
	options: {
		modelId: string;
		batch?: boolean;
	};
};

/**
 * Model pricing information
 *
 * @typedef {Object} Pricing
 * @property {string} modelName - The name of the model
 * @property {string} modelId - The ID of the model
 * @property {Object} pricing - The calculated pricing information
 * @property {number} pricing.input - The price for input tokens (in USD)
 * @property {number} pricing.output - The price for output tokens (in USD)
 */
export type Pricing = {
	modelName: string;
	modelId: string;
	standard: {
		input: number;
		output: number;
	};
	batch: {
		input: number;
		output: number;
	};
};

/**
 * Result of a pricing calculation
 *
 * @typedef {Object} Result
 * @property {number} tokenCount - The number of tokens in the input
 * @property {Pricing} pricing - The pricing information for the calculation
 */
export type Result = {
	tokenCount: number;
	pricing: Pricing;
};

/**
 * Valid model names from the MODELS constant
 *
 * @typedef {keyof typeof MODELS} ModelName
 */
export type ModelName = keyof typeof MODELS;

/**
 * Valid model IDs from the MODELS constant
 *
 * @typedef {typeof MODELS[ModelName]} ModelId
 */
export type ModelId = (typeof MODELS)[ModelName];

/**
 * Represents a token with an ID, text, token ID, and color.
 *
 * @typedef {Object} Token
 * @property {string} id - Unique ID for React key
 * @property {string} text - The text of the token
 * @property {number} tokenId - The token ID from the tokenizer
 */
export type Token = {
	id: string;
	text: string;
	tokenId: number;
};
