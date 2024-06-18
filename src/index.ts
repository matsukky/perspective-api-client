import axios, { AxiosError } from "axios";
import _ from "lodash";
import type {
	AnalyzeCommentRequest,
	AnalyzeResponse,
	AttributeType,
	CommentRequestOptions,
	RequestedAttribute,
} from "./types";
import ISO6391 from "iso-639-1";

const COMMENT_ANALYZER_URL =
	"https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze";
export const MAX_LENGTH = 20480;

class PerspectiveAPIClientError extends Error {
	constructor(message: string) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = "PerspectiveAPIClientError";
	}
}

class TextEmptyError extends PerspectiveAPIClientError {
	constructor() {
		super("text must not be empty");
		this.name = "TextEmptyError";
	}
}

class TextTooLongError extends PerspectiveAPIClientError {
	constructor() {
		super(
			`text must not be greater than ${MAX_LENGTH.toString()} characters in length`
		);
		this.name = "TextTooLongError";
	}
}

class ResponseError extends PerspectiveAPIClientError {
	response: AxiosError;

	constructor(message: string, response: AxiosError) {
		super(message);
		this.response = response;
		this.name = "ResponseError";
	}
}

class Perspective {
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
			if (ISO6391.validate(language)) {
				throw new PerspectiveAPIClientError(
					`language ${language} is not supported`
				);
			}
		});
	}

	parseAttributes(
		attributes:
			| Partial<Record<AttributeType, RequestedAttribute>>
			| Partial<AttributeType>[]
	): Partial<Record<AttributeType, RequestedAttribute>> {
		// Convert attributes to array of objects
		if (_.isArray(attributes)) {
			return _.reduce<
				AttributeType,
				Partial<Record<AttributeType, RequestedAttribute>>
			>(
				attributes,
				(acc, attribute) => {
					acc[attribute] = {};
					return acc;
				},
				{}
			);
		}
		// Make sure requested attributes score type is between 0 and 1
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
export {
	ResponseError,
	TextEmptyError,
	TextTooLongError,
	PerspectiveAPIClientError,
};
export default Perspective;
