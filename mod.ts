/**
 * @module mod
 * @description Entry point for the Bedrock Abacus library, providing token counting and pricing calculations for Amazon Bedrock models.
 */

import { MODELS, PRICING } from "./src/models.ts";
import type { CommandInput, Pricing, Result, Token } from "./src/types.ts";
import { tokenize } from "./src/tokenize.ts";

/**
 * @exports MODELS - Available model identifiers for Amazon Bedrock
 * @exports PRICING - Pricing information for Amazon Bedrock models
 * @exports tokenize - Tokenize a string of text
 */
export { MODELS, PRICING, tokenize };

/**
 * @exports CommandInput - Input configuration for pricing calculations
 * @exports Pricing - Model pricing information
 * @exports Result - Calculation result with token count and pricing
 */
export type { CommandInput, Pricing, Result };
