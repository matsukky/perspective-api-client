import type { LanguageCode } from "iso-639-1";

/**
 * Comment is a type that represents the comment in the Perspective API's analyzeComment method.
 *
 * [analyzeComment - API Doc](https://developers.perspectiveapi.com/s/about-the-api-methods?language=en_US)
 *
 */
export interface Comment {
	/**
	 * The text of the comment. Max length is 2048 characters. The text to score. This is assumed to be utf8 raw text of the text to be checked. Emoji and other non-ascii characters can be included (HTML will probably result in lower performance).
	 */
	text: string;
	/**
	 * The text type of comment.text. Either "PLAIN_TEXT" or "HTML". Currently only "PLAIN_TEXT" is supported.
	 */
	type?: "PLAIN_TEXT";
}

/**
 * ContextEntry is a list of objects providing the context for comment. **The API currently does not make use of this field, but it may influence API responses in the future.**
 *
 * [analyzeComment - API Doc](https://developers.perspectiveapi.com/s/about-the-api-methods?language=en_US)
 */
export interface ContextEntry {
	/**
	 * The text of a context object. The maximum size of context entry is 1MB.
	 */
	text?: string;
	/**
	 * The text type of the corresponding context text. Same type as comment.text. Currently only "PLAIN TEXT" is supported.
	 */
	type?: "PLAIN TEXT";
}

/**
 *
 *
 * _**RequestedAttribute**_ is a map from attribute name to a configuration object. See the @see {@link AllAttributes} for a list of available attribute names. If no configuration options are specified, defaults are used, so the empty object {} is a valid (and common) choice. You can specify multiple attribute names here to get scores from multiple attributes in a single request.
 *
 * [analyzeComment - API Doc](https://developers.perspectiveapi.com/s/about-the-api-methods?language=en_US)
 *
 */

export interface RequestedAttribute {
	/**
	 * The API won't return scores that are below this threshold for this attribute. By default, all scores are returned.
	 */
	scoreThreshold?: number;
	/**
	 * The score type returned for this attribute. Currently, only "PROBABILITY" is supported. Probability scores are in the range [0,1].
	 */
	scoreType?: "PROBABILITY";
}

/**
 * Production attributes (prod.) have been tested across multiple domains and trained on significant amounts of human-annotated comments. We recommend using production attributes for your API requests.
 *
 * [analyzeComment - API Doc](https://developers.perspectiveapi.com/s/about-the-api-methods?language=en_US)
 *
 */

export interface ProductionAttributes {
	/**
	 * Negative or hateful comments targeting someone because of their identity.
	 *
	 * Available Languages: "ar", "zh", "cs", "nl", "en", "fr", "de", "hi", "hi-Latn", "id", "it", "ja", "ko", "pl", "pt", "ru", "es", "sv"
	 */
	IDENTITY_ATTACK: RequestedAttribute;
	/**
	 * Insulting, inflammatory, or negative comment towards a person or a group of people.
	 *
	 * Available Langauges: Arabic - "ar", Chinese - "zh", Czech - "cs", Dutch - "nl", English - "en", French - "fr", Hindi - "hi", Hinglish - "hi-Latn", Indonesian - "id", Italian - "it", Japanese - "ja", Korean - "ko", Polish - "pl", Portuguese - "pt", Russian - "ru", Swedish - "sv" */
	INSULT: RequestedAttribute;
	/**
	 * Swear words, curse words, or other obscene or profane language.
	 *
	 * Available Langauges: Arabic - "ar", Chinese - "zh", Czech - "cs", Dutch - "nl", English - "en", French - "fr", Hindi - "hi", Hinglish - "hi-Latn", Indonesian - "id", Italian - "it", Japanese - "ja", Korean - "ko", Polish - "pl", Portuguese - "pt", Russian - "ru", Swedish - "sv" */
	PROFANITY: RequestedAttribute;
	/**
	 * A very hateful, aggressive, disrespectful comment or otherwise very likely to make a user leave a discussion or give up on sharing their perspective. This attribute is much less sensitive to more mild forms of toxicity, such as comments that include positive uses of curse words.
	 *
	 * Available Langauges: Arabic - "ar", Chinese - "zh", Czech - "cs", Dutch - "nl", English - "en", French - "fr", Hindi - "hi", Hinglish - "hi-Latn", Indonesian - "id", Italian - "it", Japanese - "ja", Korean - "ko", Polish - "pl", Portuguese - "pt", Russian - "ru", Swedish - "sv"
	 */
	SEVERE_TOXICITY: RequestedAttribute;
	/**
	 * Describes an intention to inflict pain, injury, or violence against an individual or group.
	 *
	 * Available Langauges: Arabic - "ar", Chinese - "zh", Czech - "cs", Dutch - "nl", English - "en", French - "fr", Hindi - "hi", Hinglish - "hi-Latn", Indonesian - "id", Italian - "it", Japanese - "ja", Korean - "ko", Polish - "pl", Portuguese - "pt", Russian - "ru", Swedish - "sv"
	 */
	THREAT: RequestedAttribute;
	/**
	 * A rude, disrespectful, or unreasonable comment that is likely to make people leave a discussion.
	 *
	 * Available Langauges: Arabic - "ar", Chinese - "zh", Czech - "cs", Dutch - "nl", English - "en", French - "fr", Hindi - "hi", Hinglish - "hi-Latn", Indonesian - "id", Italian - "it", Japanese - "ja", Korean - "ko", Polish - "pl", Portuguese - "pt", Russian - "ru", Swedish - "sv"
	 */
	TOXICITY: RequestedAttribute;
}

/**
 * Experimental attributes (exp.) have not been tested as thoroughly as production attributes. We recommend using experimental attributes only in non-production environments where a human is identifying and correcting errors. We’d also appreciate your feedback on these models!
 *
 * Important notes on using experimental attributes:
 *
 * - Once experimental attributes are deprecated and production attributes are created, the experimental attribute will stop working. When that happens, you will need to update the API call’s attribute name to the new production attribute name.
 * - Expect language availability to change over time as we test attribute performance and move attributes to production.
 */
export interface ExperimentalAttributes {
	/**
	 * Pickup lines, complimenting appearance, subtle sexual innuendos, etc.
	 */
	FLIRTATION: RequestedAttribute;
	/**
	 * Negative or hateful comments targeting someone because of their identity.
	 */
	IDENTITY_ATTACK_EXPERIMENTAL: RequestedAttribute;
	/**
	 * Insulting, inflammatory, or negative comment towards a person or a group of people.
	 */
	INSULT_EXPERIMENTAL: RequestedAttribute;
	/**
	 * Swear words, curse words, or other obscene or profane language.
	 */
	PROFANITY_EXPERIMENTAL: RequestedAttribute;
	/**
	 * A very hateful, aggressive, disrespectful comment or otherwise very likely to make a user leave a discussion or give up on sharing their perspective. This attribute is much less sensitive to more mild forms of toxicity, such as comments that include positive uses of curse words.
	 */
	SEVERE_TOXICITY_EXPERIMENTAL: RequestedAttribute;
	/**
	 * Contains references to sexual acts, body parts, or other lewd content.
	 */
	SEXUALLY_EXPLICIT: RequestedAttribute;
	/**
	 * Describes an intention to inflict pain, injury, or violence against an individual or group.
	 */
	THREAT_EXPERIMENTAL: RequestedAttribute;
	/**
	 * A rude, disrespectful, or unreasonable comment that is likely to make people leave a discussion.
	 */
	TOXICITY_EXPERIMENTAL: RequestedAttribute;
}

/**
 * Important notes on using experimental bridging attributes:
 * 
 * These attributes are named after [bridging systems](https://knightcolumbia.org/content/bridging-systems), “systems which increase mutual understanding and trust across divides, creating space for productive conflict” (Ovadya & Thorburn, 2023). [Learn more about how to use these classifiers.](https://medium.com/jigsaw/announcing-experimental-bridging-classifiers-in-perspective-api-578a9d59ac37)
 * 
 * These attributes are only available in English (en), and our results for performance and bias evaluation are included in the [English model cards](https://developers.perspectiveapi.com/s/about-the-api-model-cards?tabset-20254=3).
Some comments may be perceived as both bridging and toxic. Our scores can be used in combination to evaluate comments based on the desired impact (e.g. using *PERSONAL_STORY_EXPERIMENTAL* and *PROFANITY* in tandem to detect likely personal stories unlikely to contain profane language).
 *
 */

export interface BridgingAttributes {
	/**
	 * References shared interests, motivations or outlooks between the comment author and another individual, group or entity.
	 */
	AFFINITY_EXPERIMENTAL: RequestedAttribute;
	/**
	 * Identifies with or shows concern, empathy, or support for the feelings/emotions of others.
	 */
	COMPASSION_EXPERIMENTAL: RequestedAttribute;
	/**
	 * Attempts to clarify or ask follow-up questions to better understand another person or idea.
	 */
	CURIOSITY_EXPERIMENTAL: RequestedAttribute;
	/**
	 * Incorporates multiple points of view in an attempt to provide a full picture or contribute useful detail and/or context.
	 */
	NUANCE_EXPERIMENTAL: RequestedAttribute;
	/**
	 * Includes a personal experience or story as a source of support for the statements made in the comment.
	 */
	PERSONAL_STORY_EXPERIMENTAL: RequestedAttribute;
	/**
	 * Makes specific or well-reasoned points to provide a fuller understanding of the topic without disrespect or provocation.
	 */
	REASONING_EXPERIMENTAL: RequestedAttribute;
	/**
	 * Shows deference or appreciation to others, or acknowledges the validity of another person.
	 */
	RESPECT_EXPERIMENTAL: RequestedAttribute;
}

/**
 * New York Times Attributes - These attributes are experimental because they are trained on a single source of comments—New York Times (NYT) data tagged by their moderation team—and therefore may not work well for every use case.
 *
 * [analyzeComment - API Doc](https://developers.perspectiveapi.com/s/about-the-api-methods?language=en_US)
 *
 */

export interface NewYorkTimesAttributes {
	/**
	 * Attack on the author of an article or post
	 *
	 * Available Langauges: English - "en"
	 */
	ATTACK_ON_AUTHOR: RequestedAttribute;
	/**
	 * Attack on fellow commenter
	 *
	 * Available Langauges: English - "en"
	 */
	ATTACK_ON_COMMENTER: RequestedAttribute;
	/**
	 * Difficult to understand, nonsensical
	 *
	 * Available Langauges: English - "en"
	 */
	INCOHERENT: RequestedAttribute;
	/**
	 * Intending to provoke or inflame
	 *
	 * Available Langauges: English - "en"
	 */
	INFLAMMATORY: RequestedAttribute;
	/**
	 * Overall measure of the likelihood for the comment to be rejected according to the NYT's moderation
	 *
	 * Available Langauges: English - "en"
	 */
	LIKELY_TO_REJECT: RequestedAttribute;
	/**
	 * Obscene or vulgar language such as cursing
	 *
	 * Available Langauges: English - "en"
	 */
	OBSCENE: RequestedAttribute;
	/**
	 *  Irrelevant and unsolicited commercial content
	 *
	 *  Available Langauges: English - "en"
	 */
	SPAM: RequestedAttribute;
	/**
	 * Trivial or short comments
	 *
	 * Available Langauges: English - "en"
	 */
	UNSUBSTANTIAL: RequestedAttribute;
}

/**
 * _All attributes available in the Perspective API including production, experimental, bridging, and New York Times attributes._
 *
 * The Perspective API predicts the perceived impact a comment may have on a conversation by evaluating that comment across a range of emotional concepts, called attributes. When you send a request to the API, you’ll request the specific attributes you want to receive scores for. Perspective’s main attribute is *TOXICITY*, defined as “a rude, disrespectful, or unreasonable comment that is likely to make you leave a discussion”.
 *
 * [Join the perspective-announce email group](https://groups.google.com/forum/#!forum/perspective-announce) to stay in the loop on important information about new attributes, updates to existing attributes, deprecations, and language releases.
 *
 * @see {@link ProductionAttributes}
 * @see {@link ExperimentalAttributes}
 * @see {@link BridgingAttributes}
 * @see {@link NewYorkTimesAttributes}
 */
export interface AllAttributes
	extends ProductionAttributes,
		ExperimentalAttributes,
		BridgingAttributes,
		NewYorkTimesAttributes {}

export type AttributeType = keyof AllAttributes;

/**
 * _**AnalyzeCommentRequest** is the request body for the Perspective API's analyzeComment method._
 *
 * [analyzeComment - API Doc](https://developers.perspectiveapi.com/s/about-the-api-methods?language=en_US)
 *
 */

export interface AnalyzeCommentRequest extends CommentRequestOptions {
	/**
	 * The comment of the request.
	 * @see {@link Comment}
	 */
	comment: Comment;
	/**
	 * The requested attributes of the request.
	 * @see {@link RequestedAttribute}
	 * @see {@link AllAttributes}
	 */
	requestedAttributes: Partial<Record<AttributeType, RequestedAttribute>>;
}

export interface CommentRequestOptions {
	/**
	 * An opaque token that is echoed back in the response.
	 */
	clientToken?: string;
	/**
	 * An opaque identifier associating this comment with a particular community within your platform. If set, this field allows us to differentiate comments from different communities, as each community may have different norms.
	 */
	communityId?: string;
	/**
	 * The context of the request. ContextEntry is a list of objects providing the context for comment. **The API currently does not make use of this field, but it may influence API responses in the future.**
	 * @see {@link ContextEntry}
	 */
	context?: {
		entries?: ContextEntry[];
	};
	/**
	 * Whether the API is permitted to store comment and context from this request. Stored comments will be used for future research and community attribute building purposes to improve the API over time. Defaults to false (request data may be stored). Warning: This should be set to true if data being submitted is private (i.e. not publicly accessible), or if the data submitted contains content written by someone under 13 years old (or the relevant age determined by applicable law in my jurisdiction).
	 */
	doNotStore?: boolean;
	/**
	 * A list of ISO 631-1 two-letter language codes specifying the language(s) that comment is in (for example, "en", "es", "fr", "de", etc). If unspecified, the API will auto-detect the comment language. If language detection fails, the API returns an error. Note: See currently supported languages on the ‘Attributes and Languages’ page. There is no simple way to use the API across languages with production support and languages with experimental support only.
	 * @see {@link LanguageCode}
	 */
	languages?: LanguageCode[];
	/**
	 * An opaque session ID. This should be set for authorship experiences by the client side so that groups of requests can be grouped together into a session. This should not be used for any user-specific id. This is intended for abuse protection and individual sessions of interaction.
	 */
	sessionId?: string;
	/**
	 * A boolean value that indicates if the request should return spans that describe the scores for each part of the text (currently done at per-sentence level). Defaults to false.
	 */
	spanAnnotations?: boolean;
}

/**
 * SpanScore a list of per-span scores for this attribute. These scores apply to different parts of the request's comment.text. Note: Some attributes may not return spanScores at all.
 * [analyzeComment - API Doc](https://developers.perspectiveapi.com/s/about-the-api-methods?language=en_US)
 */

export interface SpanScore {
	/**
	 * Beginning character index of the text span in the request comment.
	 */
	begin: number;
	/**
	 * End of the text span in the request comment.
	 */
	end: number;
	/**
	 * The score of the span.
	 */
	score: {
		/**
		 * The attribute score for the span delimited by begin and end.
		 */
		type: string;
		/**
		 * This mirrors the requested scoreType for this attribute.
		 */
		value: number;
	};
}

/**
 * SummaryScore is a map from attribute name to a score object.
 *
 * [analyzeComment - API Doc](https://developers.perspectiveapi.com/s/about-the-api-methods?language=en_US)
 *
 */

export interface SummaryScore {
	/**
	 * The attribute summary score for the entire comment. All attributes will return a summaryScore (unless the request specified a scoreThreshold for the attribute that the summaryScore did not exceed).
	 */
	type: string;
	/**
	 * This mirrors the requested scoreType for this attribute.
	 */
	value: number;
}

/**
 * AttributeScore is a map from attribute name to a score object.
 *
 * [analyzeComment - API Doc](https://developers.perspectiveapi.com/s/about-the-api-methods?language=en_US)
 *
 */

export interface AttributeScore {
	/**
	 * A list of span scores. Each span score represents a span of text and its score.
	 * @see {@link SpanScore}
	 */
	spanScores: SpanScore[];
	/**
	 * The summary score of the attribute.
	 * @see {@link SummaryScore}
	 */
	summaryScore: SummaryScore;
}

/**
 * Response is the response body for the Perspective API's analyzeComment method.
 *
 * [analyzeComment - API Doc](https://developers.perspectiveapi.com/s/about-the-api-methods?language=en_US)
 */

export interface AnalyzeResponse {
	/**
	 * A map from attribute name to a score object.
	 * @see {@link AllAttributes}
	 * @see {@link AttributeScore}
	 */
	attributeScores: Partial<Record<AttributeType, AttributeScore>>;
	/**
	 * An opaque token that is echoed back in the response.
	 */
	clientToken: string;
	/**
	 * A list of ISO 631-1 two-letter language codes specifying the language(s) that comment is in (for example, "en", "es", "fr", "de", etc). If unspecified, the API will auto-detect the comment language. If language detection fails, the API returns an error. Note: See currently supported languages on the ‘Attributes and Languages’ page. There is no simple way to use the API across languages with production support and languages with experimental support only.
	 * @see {@link LanguageCode}
	 */
	languages: LanguageCode[];
}
