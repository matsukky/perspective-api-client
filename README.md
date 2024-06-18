# Perspective API Client SDK

Welcome to the Perspective API Client SDK! This SDK is built with TypeScript and provides an easy way to interact with the Perspective API for analyzing the toxicity of comments.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [Constructor](#constructor)
  - [Methods](#methods)
  - [Errors](#errors)
- [Types](#types)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install the SDK, you can use npm or yarn:

```sh
npm install perspective-api-client
```

or

```sh
yarn add perspective-api-client
```

## Usage

First, import and instantiate the `Perspective` class with your API key:

```typescript
import Perspective from 'perspective-api-client';

const perspective = new Perspective({ apiKey: 'YOUR_API_KEY' });
```

### Analyze a Comment

```typescript
(async () => {
  try {
    const response = await perspective.analyze('Your comment text here', ['TOXICITY']);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();
```

## API

### Constructor

#### `new Perspective(options: { apiKey: string })`

- **options.apiKey**: Your API key for accessing the Perspective API.

### Methods

#### `analyze(text: string, attributes?: Partial<Record<AttributeType, RequestedAttribute>> | AttributeType[], options?: CommentRequestOptions): Promise<AnalyzeResponse>`

Analyzes a comment for specified attributes.

- **text**: The comment text to analyze.
- **attributes**: The attributes to request scores for. Defaults to `TOXICITY` if not specified.
- **options**: Additional request [options](#options-parameter) to customize the analysis request.

### `options` Parameter

The `options` parameter in the `analyze` function is an optional configuration object that allows you to customize the behavior of the Perspective API request. It can include the following properties:

#### `clientToken`

- **Type:** `string`
- **Description:** An opaque token that is echoed back in the response. This can be used to correlate requests and responses.

#### `communityId`

- **Type:** `string`
- **Description:** An opaque identifier associating this comment with a particular community within your platform. If set, this field allows Perspective API to differentiate comments from different communities, as each community may have different norms.

#### `context`

- **Type:** `object`
  - **`entries`**: `ContextEntry[]` (optional)
- **Description:** The context of the request. `ContextEntry` is a list of objects providing the context for the comment. The API currently does not make use of this field, but it may influence API responses in the future.

#### `doNotStore`

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Whether the API is permitted to store the comment and context from this request. Stored comments will be used for future research and community attribute building purposes to improve the API over time. Set this to `true` if the data being submitted is private or contains content written by someone under 13 years old.

#### `languages`

- **Type:** `string[]`
- **Description:** A list of ISO 631-1 two-letter language codes specifying the language(s) that the comment is in (e.g., `"en"`, `"es"`, `"fr"`, `"de"`, etc.). If unspecified, the API will auto-detect the comment language. If language detection fails, the API returns an error.

#### `sessionId`

- **Type:** `string`
- **Description:** An opaque session ID. This should be set for authorship experiences by the client side so that groups of requests can be grouped together into a session. This is intended for abuse protection and individual sessions of interaction.

#### `spanAnnotations`

- **Type:** `boolean`
- **Default:** `false`
- **Description:** A boolean value that indicates if the request should return spans that describe the scores for each part of the text (currently done at the per-sentence level).

### Example Usage

Here's how you can use the `options` parameter when calling the `analyze` function:

```typescript
const perspective = new Perspective({ apiKey: "your-api-key" });

const text = "This is a sample comment.";
const attributes = { TOXICITY: {} };

const options = {
  clientToken: "1234567890",
  communityId: "my-community",
  context: {
    entries: [
      { text: "This is some context for the comment." }
    ]
  },
  doNotStore: true,
  languages: ["en"],
  sessionId: "abc123",
  spanAnnotations: true
};

perspective.analyze(text, attributes, options)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
```

In this example, the `options` object includes all the possible properties to configure the analysis request, such as specifying a client token, community ID, context, language, session ID, and whether to include span annotations in the response.

### Errors

#### `PerspectiveAPIClientError`

Base class for all SDK errors.

#### `TextEmptyError`

Thrown when the provided comment text is empty.

#### `TextTooLongError`

Thrown when the provided comment text exceeds the maximum length of 20480 characters.

#### `ResponseError`

Thrown when there is an error in the API response.

## Types

The SDK provides various TypeScript types for strong typing and better developer experience.

### `AnalyzeCommentRequest`

Request body for the Perspective API's `analyzeComment` method.

### `AnalyzeResponse`

Response body for the Perspective API's `analyzeComment` method.

### `AttributeType`

All available attributes in the Perspective API.

### `RequestedAttribute`

Configuration object for requested attributes.

### `CommentRequestOptions`

Additional options for the comment request.

For a detailed list of all types and interfaces, refer to the source code or documentation.

## Examples

### Analyze a Comment with Multiple Attributes

```typescript
(async () => {
  try {
    const response = await perspective.analyze('Your comment text here', {
      TOXICITY: {},
      SEVERE_TOXICITY: { scoreThreshold: 0.8 }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();
```

### Handle Errors

```typescript
(async () => {
  try {
    const response = await perspective.analyze('');
  } catch (error) {
    if (error instanceof perspective.TextEmptyError) {
      console.error('The comment text is empty.');
    } else {
      console.error('An error occurred:', error);
    }
  }
})();
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
