import { assertEquals, assertThrows } from "@std/assert";
import { calculate, countTokens } from "../main.ts";
import { MODELS } from "../models.ts";
import { tokenize } from "../tokenize.ts";
import { validate } from "@std/uuid/unstable-v7";

Deno.test("countTokens correctly counts tokens in a string", () => {
	assertEquals(countTokens("Hello, world!"), 4);
	assertEquals(countTokens(""), 0);
	assertEquals(countTokens("This is a test of the token counting system."), 10);
});

Deno.test("calculate works with text input for Claude 3.5 Sonnet", () => {
	const result = calculate({
		text: "Hello, world!",
		options: {
			modelId: MODELS["Claude 3.5 Sonnet"],
		},
	});

	assertEquals(result.tokenCount, 4);
	assertEquals(result.pricing.modelName, "Claude 3.5 Sonnet");
	assertEquals(result.pricing.modelId, MODELS["Claude 3.5 Sonnet"]);
	assertEquals(result.pricing.pricing.input, (4 / 1000) * 0.003);
	assertEquals(result.pricing.pricing.output, (4 / 1000) * 0.015);
});

Deno.test("calculate works with tokenCount input for Llama3.2 11B", () => {
	const result = calculate({
		tokenCount: 1000,
		options: {
			modelId: MODELS["Llama3.2 11B"],
		},
	});

	assertEquals(result.tokenCount, 1000);
	assertEquals(result.pricing.modelName, "Llama3.2 11B");
	assertEquals(result.pricing.modelId, MODELS["Llama3.2 11B"]);
	assertEquals(result.pricing.pricing.input, 0.00016);
	assertEquals(result.pricing.pricing.output, 0.00016);
});

Deno.test("calculate works with batch pricing option", () => {
	const result = calculate({
		tokenCount: 2000,
		options: {
			modelId: MODELS["Claude 3 Opus"],
			batch: true,
		},
	});

	assertEquals(result.tokenCount, 2000);
	assertEquals(result.pricing.modelName, "Claude 3 Opus");
	assertEquals(result.pricing.pricing.input, (2000 / 1000) * 0.0075);
	assertEquals(result.pricing.pricing.output, (2000 / 1000) * 0.0375);
});

Deno.test("calculate throws error when neither text nor tokenCount is provided", () => {
	assertThrows(
		() => {
			calculate({
				options: {
					modelId: MODELS["Claude 3.5 Sonnet"],
				},
			} as any);
		},
		Error,
		"Either text or tokenCount must be provided",
	);
});

Deno.test("calculate throws error with unknown model ID", () => {
	assertThrows(
		() => {
			calculate({
				text: "Hello",
				options: {
					modelId: "unknown-model-id",
				},
			});
		},
		Error,
		"Unknown model ID: unknown-model-id",
	);
});

Deno.test("calculate works correctly with Amazon Nova models", () => {
	const resultPro = calculate({
		tokenCount: 5000,
		options: {
			modelId: MODELS["Amazon Nova Pro"],
		},
	});

	assertEquals(resultPro.tokenCount, 5000);
	assertEquals(resultPro.pricing.modelName, "Amazon Nova Pro");
	assertEquals(resultPro.pricing.pricing.input, (5000 / 1000) * 0.0008);
	assertEquals(resultPro.pricing.pricing.output, (5000 / 1000) * 0.00024);

	// Test batch pricing
	const resultLite = calculate({
		tokenCount: 5000,
		options: {
			modelId: MODELS["Amazon Nova Lite"],
			batch: true,
		},
	});

	assertEquals(resultLite.pricing.modelName, "Amazon Nova Lite");
	assertEquals(resultLite.pricing.pricing.input, (5000 / 1000) * 0.0002);
	assertEquals(resultLite.pricing.pricing.output, (5000 / 1000) * 0.0006);
});

Deno.test("calculate handles large token counts without precision issues", () => {
	const result = calculate({
		tokenCount: 1_000_000,
		options: {
			modelId: MODELS["Claude 3.5 Haiku"],
		},
	});

	assertEquals(result.tokenCount, 1_000_000);
	assertEquals(result.pricing.pricing.input, (1_000_000 / 1000) * 0.0008);
	assertEquals(result.pricing.pricing.output, (1_000_000 / 1000) * 0.004);
});

Deno.test("tokenize correctly tokenizes a string", () => {
	const tokens = tokenize("Hello, world!");

	assertEquals(tokens.length, 4);
	assertEquals(tokens[0].text, "Hello");
	assertEquals(tokens[1].text, ",");
	assertEquals(tokens[2].text, " world");
	assertEquals(tokens[3].text, "!");

	// Validate UUIDs
	for (const token of tokens) {
		assertEquals(validate(token.id), true);
	}
});
