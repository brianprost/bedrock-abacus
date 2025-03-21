# Bedrock Abacus

A TypeScript utility for calculating token counts and pricing for Amazon Bedrock
models.

> **Note:** Pricing is as of
> [2025-03-19](https://aws.amazon.com/bedrock/pricing/)

## Features

- Calculate token counts for text input
- Calculate pricing for Amazon Bedrock models
- Support for both standard and batch pricing
- Support for popular models including:
  - Claude 3.* Sonnet
  - Claude 3.6 Haiku
  - Claude 3 Opus
  - Llama3.3 70B
  - Llama3.2 11B
  - Amazon Nova Pro and Lite

## Installation

You can use Bedrock Abacus directly in your project:

```ts
import { calculate, countTokens, MODELS } from "bedrock-abacus";
```

## Usage

### Calculating Token Count and Pricing

```ts
import { calculate, countTokens, MODELS } from "bedrock-abacus";

// Calculate pricing based on text
const result = calculate({
	text: "You picked the right time but the wrong guy.",
	options: {
		modelId: MODELS["Claude 3.5 Sonnet"],
		batch: false,
	},
});

console.log(`Token count: ${result.tokenCount}`);
console.log(`Input cost: $${result.pricing.pricing.input.toFixed(6)}`);
console.log(`Output cost: $${result.pricing.pricing.output.toFixed(6)}`);

// Or calculate pricing based on token count
const result2 = calculate({
	tokenCount: 1000,
	options: {
		modelId: MODELS["Llama3.3 70B"],
		batch: true,
	},
});
```

### Get Token Count Only

```ts
import { countTokens } from "bedrock-abacus";

const count = countTokens("Scorekeeper, deduct one life.");
console.log(`Token count: ${count}`);
```

### Available Models

The library includes all current Amazon Bedrock models with their IDs and
pricing:

```ts
import { MODELS, PRICING } from "bedrock-abacus";

// Access model IDs
console.log(MODELS["Claude 3.5 Sonnet"]);

// Access pricing
const pricingInfo = PRICING["Claude 3.5 Sonnet"];
console.log(`Standard input: $${pricingInfo.standard.input} per 1K tokens`);
console.log(`Standard output: $${pricingInfo.standard.output} per 1K tokens`);
```

## Development

```bash
# Run the development server
deno task dev

# Run tests
deno test
```

## License

MIT

## Contributing

Contributions are welcome! Plz help
