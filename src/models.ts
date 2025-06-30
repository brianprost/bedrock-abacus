/**
 * @module models
 * @description Model information and pricing for Amazon Bedrock models
 * Now integrates with models.dev database for up-to-date pricing information
 */

import { fetchModelsDevData, filterBedrockModels, transformModelsDevData } from "./models-dev.ts";

/**
 * Fallback model mapping - used when models.dev is unavailable
 * Mapping of model names to their Amazon Bedrock model IDs
 *
 * @constant
 * @type {Object.<string, string>}
 */
const FALLBACK_MODELS = {
	"Claude 3.5 Sonnet v2": "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
	"Claude 3.5 Sonnet": "us.anthropic.claude-3-5-sonnet-20240620-v1:0",
	"Claude 3.5 Haiku": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
	"Claude 3 Opus": "us.anthropic.claude-3-opus-20240229-v1:0",
	"Llama3.3 70B": "us.meta.llama3-3-70b-instruct-v1:0",
	"Llama3.2 11B": "us.meta.llama3-2-11b-instruct-v1:0",
	"Amazon Nova Pro": "us.amazon.nova-pro-v1:0",
	"Amazon Nova Lite": "us.amazon.nova-lite-v1:0",
} as const;

/**
 * Fallback pricing information - used when models.dev is unavailable
 * Contains input and output prices per 1000 tokens for both standard and batch pricing
 *
 * @constant
 * @type {Object.<string, {standard: {input: number, output: number}, batch: {input: number, output: number}}>}
 */
const FALLBACK_PRICING = {
	"Claude 3.5 Sonnet v2": {
		standard: { input: 0.003, output: 0.015 },
		batch: { input: 0.0015, output: 0.0075 },
	},
	"Claude 3.5 Sonnet": {
		standard: { input: 0.003, output: 0.015 },
		batch: { input: 0.0015, output: 0.0075 },
	},
	"Claude 3.5 Haiku": {
		standard: { input: 0.0008, output: 0.004 },
		batch: { input: 0.0005, output: 0.0025 },
	},
	"Claude 3 Opus": {
		standard: { input: 0.015, output: 0.075 },
		batch: { input: 0.0075, output: 0.0375 },
	},
	"Llama3.3 70B": {
		standard: { input: 0.00072, output: 0.00072 },
		batch: { input: 0.00036, output: 0.00036 },
	},
	"Llama3.2 11B": {
		standard: { input: 0.00016, output: 0.00016 },
		batch: { input: 0.00008, output: 0.00008 },
	},
	"Amazon Nova Pro": {
		standard: { input: 0.0008, output: 0.0032 },
		batch: { input: 0.0004, output: 0.0016 },
	},
	"Amazon Nova Lite": {
		standard: { input: 0.0004, output: 0.0012 },
		batch: { input: 0.0002, output: 0.0006 },
	},
} as const;

// Global cache for models.dev data
let cachedModelsData: { MODELS: typeof FALLBACK_MODELS; PRICING: typeof FALLBACK_PRICING } | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Loads model data from models.dev with fallback to hardcoded data
 * @returns Promise<{MODELS: typeof FALLBACK_MODELS, PRICING: typeof FALLBACK_PRICING}>
 */
async function loadModelsData(): Promise<{
	MODELS: typeof FALLBACK_MODELS;
	PRICING: typeof FALLBACK_PRICING;
}> {
	const now = Date.now();
	
	// Return cached data if it's still fresh
	if (cachedModelsData && (now - lastFetchTime) < CACHE_DURATION) {
		return cachedModelsData;
	}

	try {
		// Try to fetch fresh data from models.dev
		const modelsDevData = await fetchModelsDevData();
		const bedrockModels = filterBedrockModels(modelsDevData);
		const transformedData = transformModelsDevData(bedrockModels);
		
		// Merge with fallback data to ensure we have all models
		const mergedModels = { ...FALLBACK_MODELS, ...transformedData.MODELS };
		const mergedPricing = { ...FALLBACK_PRICING, ...transformedData.PRICING };
		
		cachedModelsData = {
			MODELS: mergedModels as typeof FALLBACK_MODELS,
			PRICING: mergedPricing as typeof FALLBACK_PRICING,
		};
		lastFetchTime = now;
		
		return cachedModelsData;
	} catch (error) {
		console.warn("Failed to load models.dev data, using fallback:", error);
		// Use fallback data
		cachedModelsData = {
			MODELS: FALLBACK_MODELS,
			PRICING: FALLBACK_PRICING,
		};
		return cachedModelsData;
	}
}

/**
 * Get models data (async version for when you need fresh data)
 */
export async function getModelsData(): Promise<{
	MODELS: typeof FALLBACK_MODELS;
	PRICING: typeof FALLBACK_PRICING;
}> {
	return loadModelsData();
}

/**
 * Mapping of model names to their Amazon Bedrock model IDs
 * This is the synchronous version that uses cached or fallback data
 *
 * @constant
 * @type {Object.<string, string>}
 */
export const MODELS = new Proxy(FALLBACK_MODELS, {
	get(target, prop) {
		// Return cached data if available, otherwise fallback
		if (cachedModelsData?.MODELS && prop in cachedModelsData.MODELS) {
			return cachedModelsData.MODELS[prop as keyof typeof cachedModelsData.MODELS];
		}
		return target[prop as keyof typeof target];
	},
});

/**
 * Pricing information for each model
 * Contains input and output prices per 1000 tokens for both standard and batch pricing
 * This is the synchronous version that uses cached or fallback data
 *
 * @constant
 * @type {Object.<string, {standard: {input: number, output: number}, batch: {input: number, output: number}}>}
 */
export const PRICING = new Proxy(FALLBACK_PRICING, {
	get(target, prop) {
		// Return cached data if available, otherwise fallback
		if (cachedModelsData?.PRICING && prop in cachedModelsData.PRICING) {
			return cachedModelsData.PRICING[prop as keyof typeof cachedModelsData.PRICING];
		}
		return target[prop as keyof typeof target];
	},
});

// Initialize the cache by trying to load data immediately
loadModelsData().catch(() => {
	// Silently fail and use fallback data
});
