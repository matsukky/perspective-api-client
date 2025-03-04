import axios, { AxiosError } from "axios";
import type {
	AnalyzeCommentRequest,
	AnalyzeResponse,
	AttributeType,
	CommentRequestOptions,
	RequestedAttribute,
	LanguageCode
} from "./types";

export const availableAttributes = {
  IDENTITY_ATTACK: ['ar', 'zh', 'cs', 'nl', 'en', 'fr', 'de', 'hi', 'hi-Latn', 'id', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'es', 'sv'],
  INSULT: ['ar', 'zh', 'cs', 'nl', 'en', 'fr', 'hi', 'hi-Latn', 'id', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'sv'],
  PROFANITY: ['ar', 'zh', 'cs', 'nl', 'en', 'fr', 'hi', 'hi-Latn', 'id', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'sv'],
  SEVERE_TOXICITY: ['ar', 'zh', 'cs', 'nl', 'en', 'fr', 'hi', 'hi-Latn', 'id', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'sv'],
  THREAT: ['ar', 'zh', 'cs', 'nl', 'en', 'fr', 'hi', 'hi-Latn', 'id', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'sv'],
  TOXICITY: ['ar', 'zh', 'cs', 'nl', 'en', 'fr', 'hi', 'hi-Latn', 'id', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'sv'],

  FLIRTATION: ['en'],
  IDENTITY_ATTACK_EXPERIMENTAL: ['en'],
  INSULT_EXPERIMENTAL: ['en'],
  PROFANITY_EXPERIMENTAL: ['en'],
  SEVERE_TOXICITY_EXPERIMENTAL: ['en'],
  SEXUALLY_EXPLICIT: ['en'],
  THREAT_EXPERIMENTAL: ['en'],
  TOXICITY_EXPERIMENTAL: ['en'],

  AFFINITY_EXPERIMENTAL: ['en'],
  COMPASSION_EXPERIMENTAL: ['en'],
  CURIOSITY_EXPERIMENTAL: ['en'],
  NUANCE_EXPERIMENTAL: ['en'],
  PERSONAL_STORY_EXPERIMENTAL: ['en'],
  REASONING_EXPERIMENTAL: ['en'],
  RESPECT_EXPERIMENTAL: ['en'],
  
  ATTACK_ON_AUTHOR: ['en'],
  ATTACK_ON_COMMENTER: ['en'],
  INCOHERENT: ['en'],
  INFLAMMATORY: ['en'],
  LIKELY_TO_REJECT: ['en'],
  OBSCENE: ['en'],
  SPAM: ['en'],
  UNSUBSTANTIAL: ['en']
}

type AvailableAttributes = keyof typeof availableAttributes;

const availableLanguages = [
  'ar', // Arabic
  'zh', // Chinese
  'cs', // Czech
  'nl', // Dutch
  'en', // English
  'fr', // French
  'de', // German
  'hi', // Hindi
  'hi-Latn', // Hinglish
  'id', // Indonesian
  'it', // Italian
  'ja', // Japanese
  'ko', // Korean
  'pl', // Polish
  'pt', // Portuguese
  'ru', // Russian
  'es', // Spanish
  'sv'  // Swedish
] 

const COMMENT_ANALYZER_URL =
	"https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze";
export const MAX_LENGTH = 20480;

export class PerspectiveAPIClientError extends Error {
	constructor(message: string) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = "PerspectiveAPIClientError";
	}
}

export class TextEmptyError extends PerspectiveAPIClientError {
	constructor() {
		super("text must not be empty");
		this.name = "TextEmptyError";
	}
}

export class TextTooLongError extends PerspectiveAPIClientError {
	constructor() {
		super(
			`text must not be greater than ${MAX_LENGTH.toString()} characters in length`
		);
		this.name = "TextTooLongError";
	}
}

export class ResponseError extends PerspectiveAPIClientError {
	response: AxiosError;

	constructor(message: string, response: AxiosError) {
		super(message);
		this.response = response;
		this.name = "ResponseError";
	}
}

export default class Perspective {
	static readonly PerspectiveAPIClientError: typeof PerspectiveAPIClientError;
	static readonly TextEmptyError: typeof TextEmptyError;
	static readonly TextTooLongError: typeof TextTooLongError;
	static readonly ResponseError: typeof ResponseError;

	apiKey: string;

	constructor({ apiKey }: { apiKey: string }) {
		this.apiKey = apiKey;
		if (!this.apiKey) {
			throw new Error("Must provide options.apiKey");
		}
	}

	async analyze(
		text: string,
		attriubtes?:
			| Partial<Record<AttributeType, RequestedAttribute>>
			| AttributeType[],
		options?: CommentRequestOptions
	): Promise<AnalyzeResponse> {
		const request: AnalyzeCommentRequest = {
			comment: { text },
			requestedAttributes: this.parseAttributes(attriubtes ?? { TOXICITY: {} }),
			...options,
		};

		this.validateComment(text);
		if (options?.languages) {
			this.validateLanguages(options.languages);
			request.languages = options.languages;
		}

		const response = await axios
			.post<AnalyzeResponse>(COMMENT_ANALYZER_URL, request, {
				params: { key: this.apiKey },
			})
			.catch((error: unknown) => {
				if (axios.isAxiosError(error)) {
					const responseError = new ResponseError(error.message, error);
					throw responseError;
				}
				console.error("Unknown error", error);
				return Promise.reject(new Error("Unknown error - see logs"));
			});
		return response.data;
	}

	validateComment(text: string): void {
		if (!text) {
			throw new TextEmptyError();
		}
		if (text.length > MAX_LENGTH) {
			throw new TextTooLongError();
		}
	}

	validateLanguages(languages: string[]): void {
		// Make sure requested languages are valid, if provided
		languages.forEach((language) => {
			if (!availableLanguages.includes(language as LanguageCode)) {
				throw new PerspectiveAPIClientError(
					`language ${language} is not supported`
				);
			}
		});
		
	}

	validateAttributesAndLanguages(
		attributes: AvailableAttributes[], 
		languages: LanguageCode[]
	): void {
		attributes.forEach(attribute => {
			/* // Check if the attribute exists in availableAttributes
			if (!(attribute in availableAttributes)) {
				throw new PerspectiveAPIClientError(
					`Attribute ${attribute} is not a valid attribute`
				);
			} */
	
			languages.forEach(language => {
				const allowedLanguages = availableAttributes[attribute];
				
				if (!allowedLanguages.includes(language)) {
					throw new PerspectiveAPIClientError(
						`Language ${language} is not supported for attribute ${attribute}`
					);
				}

			});		});
	}

	parseAttributes(
		attributes:
			| Partial<Record<AttributeType, RequestedAttribute>>
			| Partial<AttributeType>[]
	): Partial<Record<AttributeType, RequestedAttribute>> {
		if (Array.isArray(attributes)) {
			return attributes.reduce<Partial<Record<AttributeType, RequestedAttribute>>>(
				(acc, attribute) => {
					acc[attribute] = {};
					return acc;
				},
				{}
			);
		}

		Object.values(attributes).forEach((attribute) => {
			if (
				attribute.scoreThreshold &&
				(attribute.scoreThreshold < 0 || attribute.scoreThreshold > 1)
			) {
				throw new PerspectiveAPIClientError(
					"scoreThreshold must be between 0 and 1"
				);
			}
		});
		return attributes;
	}
}

export * as Types from "./types";