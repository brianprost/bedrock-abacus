export const MODELS = {
	"Claude 3.5 Sonnet": "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
	"Claude 3.5 Haiku": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
	"Claude 3 Opus": "us.anthropic.claude-3-opus-20240229-v1:0",
	"Llama3.3 70B": "us.meta.llama3-3-70b-instruct-v1:0",
	"Llama3.2 11B": "us.meta.llama3-2-11b-instruct-v1:0",
	"Amazon Nova Pro": "us.amazon.nova-pro-v1:0",
	"Amazon Nova Lite": "us.amazon.nova-lite-v1:0",
} as const;

export const PRICING = {
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
		standard: { input: 0.0008, output: 0.00024 },
		batch: { input: 0.0004, output: 0.0016 },
	},
	"Amazon Nova Lite": {
		standard: { input: 0.0004, output: 0.0012 },
		batch: { input: 0.0002, output: 0.0006 },
	},
} as const;
