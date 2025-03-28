/**
 * @module mod
 * @description Entry point for the Bedrock Abacus library, providing token counting and pricing calculations for Amazon Bedrock models.
 */

import { MODELS, PRICING } from "./src/models.ts";
import type { CommandInput, Pricing, Result, Token } from "./src/types.ts";
import { tokenize } from "./src/tokenize.ts";
import { calculate } from "./src/main.ts";

/**
 * @exports MODELS - Available model identifiers for Amazon Bedrock
 * @exports PRICING - Pricing information for Amazon Bedrock models
 * @exports tokenize - Tokenize a string of text
 * @exports calculate - Calculate token count and pricing for a given text and model
 */
export { calculate, MODELS, PRICING, tokenize };

/**
 * @exports CommandInput - Input configuration for pricing calculations
 * @exports Pricing - Model pricing information
 * @exports Result - Calculation result with token count and pricing
 * @exports Token - Token information with start and end indices
 */
export type { CommandInput, Pricing, Result, Token };
