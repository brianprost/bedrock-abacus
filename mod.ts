/**
 * @module mod
 * @description Entry point for the Bedrock Abacus library, providing token counting and pricing calculations for AWS Bedrock models.
 */

import { MODELS, PRICING } from "./src/models.ts";
import type { CommandInput, Pricing, Result } from "./src/types.ts";

/**
 * @exports MODELS - Available model identifiers for AWS Bedrock
 * @exports PRICING - Pricing information for AWS Bedrock models
 */
export { MODELS, PRICING };

/**
 * @exports CommandInput - Input configuration for pricing calculations
 * @exports Pricing - Model pricing information
 * @exports Result - Calculation result with token count and pricing
 */
export type { CommandInput, Pricing, Result };
