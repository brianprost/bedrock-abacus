import { encode } from "gpt-tokenizer";
import { Token } from "./types.ts";
import { generate as uuidv7 } from "@std/uuid/unstable-v7";

/**
 * Tokenizes a given text string into an array of Token objects.
 * Each token contains a unique ID, the original token ID, and the text content
 *
 * The function works by:
 * 1. Encoding the input text into token IDs
 * 2. Iteratively matching characters to token boundaries
 * 3. Creating Token objects for each matched segment
 *
 * @param text - The input string to be tokenized
 * @returns An array of Token objects, each containing:
 *          - id: A unique UUID (v7)
 *          - tokenId: The original encoded token ID
 *          - text: The text content of the token
 *
 * @example
 * ```typescript
 * const tokens = tokenize("Hello, world!");
 * // Returns: [{id: "...", tokenId: 123, text: "Hello"}, ...]
 * ```
 */
export function tokenize(text: string): Token[] {
	const tokenIds = encode(text);
	const tokens: Token[] = [];

	// Split the text into utf-8 characters
	const chars = Array.from(text);
	let currentIndex = 0;

	for (const tokenId of tokenIds) {
		// Take characters until we match the next token boundary
		let tokenText = "";
		while (currentIndex < chars.length) {
			tokenText += chars[currentIndex];
			currentIndex++;

			// Try encoding the current token text
			const check = encode(tokenText);
			if (check[0] === tokenId) break;
		}

		tokens.push({
			id: uuidv7(),
			tokenId, // Keep original token ID for reference
			text: tokenText,
		});
	}

	return tokens;
}
