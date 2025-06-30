/**
 * @module models-dev
 * @description Integration with models.dev database for fetching AI model information
 */

/**
 * Type definitions for models.dev API data
 */
export interface ModelsDevModel {
	name: string;
	cost?: {
		input?: number;
		output?: number;
		cache_read?: number;
		cache_write?: number;
	};
	limit?: {
		context?: number;
		output?: number;
	};
	modalities?: {
		input?: string[];
		output?: string[];
	};
	attachment?: boolean;
	reasoning?: boolean;
	tool_call?: boolean;
	temperature?: boolean;
	knowledge?: string;
	release_date?: string;
	last_updated?: string;
}

export interface ModelsDevData {
	[modelId: string]: ModelsDevModel;
}

/**
 * Fetches model data from models.dev API
 * @returns Promise<ModelsDevData> - The models data from models.dev
 */
export async function fetchModelsDevData(): Promise<ModelsDevData> {
	try {
		const response = await fetch('https://models.dev/api.json');
		if (!response.ok) {
			throw new Error(`Failed to fetch models.dev data: ${response.status}`);
		}
		const data = await response.json();
		return data as ModelsDevData;
	} catch (error) {
		console.warn('Failed to fetch models.dev data:', error);
		throw error;
	}
}

/**
 * Filters models.dev data to only include Amazon Bedrock models
 * @param data - The full models.dev data
 * @returns ModelsDevData - Only Amazon Bedrock models
 */
export function filterBedrockModels(data: ModelsDevData): ModelsDevData {
	const bedrockModels: ModelsDevData = {};
	
	for (const [modelId, modelData] of Object.entries(data)) {
		// Check if this is an Amazon Bedrock model by looking at the model ID pattern
		if (modelId.includes('anthropic.') || 
			modelId.includes('amazon.') || 
			modelId.includes('meta.') ||
			modelId.includes('ai21.') ||
			modelId.includes('cohere.') ||
			modelId.includes('deepseek.')) {
			bedrockModels[modelId] = modelData;
		}
	}
	
	return bedrockModels;
}

/**
 * Converts models.dev pricing format to bedrock-abacus format
 * - models.dev uses cost per million tokens
 * - bedrock-abacus uses cost per 1000 tokens
 * @param cost - Cost in per million tokens
 * @returns Cost in per 1000 tokens
 */
export function convertPricing(cost: number): number {
	return cost / 1000; // Convert from per million to per 1000 tokens
}

/**
 * Maps models.dev model IDs to friendly names used in bedrock-abacus
 * @param modelId - The models.dev model ID
 * @returns Friendly name for the model
 */
export function getModelFriendlyName(modelId: string): string {
	// Map common model IDs to friendly names
	const nameMap: { [key: string]: string } = {
		'anthropic.claude-3-5-sonnet-20241022-v2:0': 'Claude 3.5 Sonnet v2',
		'anthropic.claude-3-5-sonnet-20240620-v1:0': 'Claude 3.5 Sonnet',
		'anthropic.claude-3-5-haiku-20241022-v1:0': 'Claude 3.5 Haiku',
		'anthropic.claude-3-opus-20240229-v1:0': 'Claude 3 Opus',
		'meta.llama3-3-70b-instruct-v1:0': 'Llama3.3 70B',
		'meta.llama3-2-11b-instruct-v1:0': 'Llama3.2 11B',
		'amazon.nova-pro-v1:0': 'Amazon Nova Pro',
		'amazon.nova-lite-v1:0': 'Amazon Nova Lite',
	};

	return nameMap[modelId] || modelId;
}

/**
 * Maps models.dev model IDs to bedrock-abacus model IDs (with us. prefix)
 * @param modelId - The models.dev model ID
 * @returns The corresponding bedrock-abacus model ID
 */
export function getBedrockModelId(modelId: string): string {
	// Map models.dev IDs to bedrock-abacus IDs (add us. prefix)
	const idMap: { [key: string]: string } = {
		'anthropic.claude-3-5-sonnet-20241022-v2:0': 'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
		'anthropic.claude-3-5-sonnet-20240620-v1:0': 'us.anthropic.claude-3-5-sonnet-20240620-v1:0',
		'anthropic.claude-3-5-haiku-20241022-v1:0': 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
		'anthropic.claude-3-opus-20240229-v1:0': 'us.anthropic.claude-3-opus-20240229-v1:0',
		'meta.llama3-3-70b-instruct-v1:0': 'us.meta.llama3-3-70b-instruct-v1:0',
		'meta.llama3-2-11b-instruct-v1:0': 'us.meta.llama3-2-11b-instruct-v1:0',
		'amazon.nova-pro-v1:0': 'us.amazon.nova-pro-v1:0',
		'amazon.nova-lite-v1:0': 'us.amazon.nova-lite-v1:0',
	};

	return idMap[modelId] || `us.${modelId}`;
}

/**
 * Transforms models.dev data into bedrock-abacus format
 * @param modelsDevData - Data from models.dev
 * @returns Object with MODELS and PRICING in bedrock-abacus format
 */
export function transformModelsDevData(modelsDevData: ModelsDevData): {
	MODELS: { [name: string]: string };
	PRICING: { [name: string]: { standard: { input: number; output: number }; batch: { input: number; output: number } } };
} {
	const MODELS: { [name: string]: string } = {};
	const PRICING: { [name: string]: { standard: { input: number; output: number }; batch: { input: number; output: number } } } = {};

	for (const [modelId, modelData] of Object.entries(modelsDevData)) {
		const friendlyName = getModelFriendlyName(modelId);
		const bedrockModelId = getBedrockModelId(modelId);
		
		// Add to MODELS mapping
		MODELS[friendlyName] = bedrockModelId;

		// Add pricing if available
		if (modelData.cost?.input !== undefined && modelData.cost?.output !== undefined) {
			const standardInput = convertPricing(modelData.cost.input);
			const standardOutput = convertPricing(modelData.cost.output);
			
			// For batch pricing, we'll use a 50% discount as a reasonable estimate
			// since models.dev doesn't provide batch pricing data
			const batchInput = standardInput * 0.5;
			const batchOutput = standardOutput * 0.5;

			PRICING[friendlyName] = {
				standard: {
					input: standardInput,
					output: standardOutput,
				},
				batch: {
					input: batchInput,
					output: batchOutput,
				},
			};
		}
	}

	return { MODELS, PRICING };
}