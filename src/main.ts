import { encode } from "gpt-tokenizer";
import { MODELS, PRICING } from "./models.ts";
import type { CommandInput, Pricing, Result } from "./types.ts";

/**
 * Calculate token count and pricing for a given text and model
 */
export function calculate(input: CommandInput): Result {
	// Validate input
	if (input.text === undefined && input.tokenCount === undefined) {
		throw new Error("Either text or tokenCount must be provided");
	}

	// Get token count
	const tokenCount = input.tokenCount ?? encode(input.text!).length;

	// Find model name from ID
	const modelName = findModelNameById(input.options.modelId);
	if (!modelName) {
		throw new Error(`Unknown model ID: ${input.options.modelId}`);
	}

	// Get pricing
	const pricingMode = input.options.batch ? "batch" : "standard";
	const modelPricing = PRICING[modelName as keyof typeof PRICING];

	if (!modelPricing) {
		throw new Error(`No pricing information for model: ${modelName}`);
	}

	const pricing: Pricing = {
		modelName,
		modelId: input.options.modelId,
		pricing: {
			input: (tokenCount / 1000) * modelPricing[pricingMode].input,
			output: (tokenCount / 1000) * modelPricing[pricingMode].output,
		},
	};

	return {
		tokenCount,
		pricing,
	};
}

/**
 * Calculate token count for a given text
 */
export function countTokens(text: string): number {
	return encode(text).length;
}

/**
 * Find model name by its ID
 */
function findModelNameById(modelId: string): string | undefined {
	return Object.entries(MODELS).find(([_, id]) => id === modelId)?.[0];
}
