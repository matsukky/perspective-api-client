import { afterEach, assert, beforeEach, expect, test } from "vitest";
import nock from "nock";
import { repeat } from "lodash";
import Perspective, { ResponseError, TextTooLongError } from "./index";
import type { AnalyzeResponse } from "./types/index";

beforeEach(() => {
	console.log("beforeEach");
	nock.disableNetConnect();
});

afterEach(() => {
	console.log("afterEach");
	nock.enableNetConnect();
});

const MOCK_RESPONSE: AnalyzeResponse = {
	attributeScores: {
		TOXICITY: {
			spanScores: [
				{
					begin: 0,
					end: 56,
					score: {
						value: 0.8728314,
						type: "PROBABILITY",
					},
				},
			],
			summaryScore: {
				value: 0.8728314,
				type: "PROBABILITY",
			},
		},
	},
	languages: ["en"],
	clientToken: "",
};

const MOCK_REQUEST = {
	text: "testing is for dummies",
	requestedAttributes: {
		TOXICITY: {},
	},
};
const safeLookup =
	<Key extends string>(key: Key) =>
	<T extends Record<string, unknown>>(record: T): T[Key] | undefined =>
		record[key];

const createPerspective = () =>
	new Perspective({ apiKey: process.env.PERSPECTIVE_API_KEY ?? "mock-key" });

// INFO: Removed test as API Key is required to instantiate Perspective
// test("requires apiKey", (t) => {
//   t.throws(() => new Perspective(), Error);
// });

test("analyze (mocked)", async () => {
	const p = createPerspective();
	// pass allowUnmocked: true so that integration tests will work
	nock("https://commentanalyzer.googleapis.com", { allowUnmocked: true })
		.filteringRequestBody(() => "*")
		.post("/v1alpha1/comments:analyze", "*")
		.query(true)
		.reply(200, MOCK_RESPONSE);
	const result = await p.analyze(
		MOCK_REQUEST.text,
		MOCK_REQUEST.requestedAttributes
	);
	assert.deepEqual(result, MOCK_RESPONSE);
});

test("analyze (mocked) handles errors from API", async () => {
	const p = createPerspective();
	// pass allowUnmocked: true so that integration tests will work
	nock("https://commentanalyzer.googleapis.com", { allowUnmocked: true })
		.filteringRequestBody(() => "*")
		.post("/v1alpha1/comments:analyze", "*")
		.query(true)
		.reply(400, {
			error: {
				message: "invalid!",
			},
		});
	try {
		await p.analyze(MOCK_REQUEST.text, MOCK_REQUEST.requestedAttributes);
	} catch (error) {
		expect(error).toBeTruthy();
		assert.deepEqual((error as ResponseError).response.response?.data, {
			error: {
				message: "invalid!",
			},
		});
	}

	// await expect(p.analyze(MOCK_REQUEST)).rejects.toThrow("invalid!");
});

test("analyze (mocked) handles errors with no message", async () => {
	const p = createPerspective();
	// pass allowUnmocked: true so that integration tests will work
	nock("https://commentanalyzer.googleapis.com", { allowUnmocked: true })
		.filteringRequestBody(() => "*")
		.post("/v1alpha1/comments:analyze", "*")
		.query(true)
		.reply(400, {
			error: { code: 400 },
		});

	// Convert tests to vitest

	try {
		await p.analyze(MOCK_REQUEST.text, MOCK_REQUEST.requestedAttributes);
	} catch (error) {
		expect(error).toBeTruthy();
		assert.deepEqual((error as ResponseError).response.response?.data, {
			error: { code: 400 },
		});
	}
});

test("analyze with attributes passed as an array", async () => {
	const p = createPerspective();
	let payload;

	nock("https://commentanalyzer.googleapis.com", { allowUnmocked: true })
		.filteringRequestBody(() => "*")
		.post("/v1alpha1/comments:analyze", "*")
		.query(true)
		.reply(200, {
			attributeScores: {
				TOXICITY: {
					spanScores: [
						{
							begin: 0,
							end: 56,
							score: {
								value: 0.8728314,
								type: "PROBABILITY",
							},
						},
					],
					summaryScore: {
						value: 0.8728314,
						type: "PROBABILITY",
					},
				},
				IDENTITY_ATTACK: {
					spanScores: [
						{
							begin: 0,
							end: 56,
							score: {
								value: 0.8728314,
								type: "PROBABILITY",
							},
						},
					],
					summaryScore: {
						value: 0.8728314,
						type: "PROBABILITY",
					},
				},
			},
			languages: ["en"],
			clientToken: "",
		});

	try {
		payload = await p.analyze("good test", {
			TOXICITY: {},
			IDENTITY_ATTACK: {},
		});
	} catch (error) {
		console.log(error);

		expect(error).toBeTruthy();
		expect(error).toBeInstanceOf(Error);
	}
	expect(payload).toBeTruthy();

	if (!payload) return;
	expect(safeLookup("TOXICITY")(payload.attributeScores)).toBeTruthy();
	expect(safeLookup("IDENTITY_ATTACK")(payload.attributeScores)).toBeTruthy();
});

test("> 3000 characters in text is invalid", async () => {
	const p = createPerspective();
	const text = repeat("x", 20481);
	// prettier-ignore

	try {
	await	p.analyze(
 text ,
			{
				TOXICITY: {},
			},
	);
	} catch (error) {
		expect(error).toBeTruthy();
		expect(error).toBeInstanceOf(TextTooLongError);
	}
});

if (process.env.PERSPECTIVE_API_KEY && process.env.TEST_INTEGRATION) {
	test("integration:analyze", async () => {
		nock.enableNetConnect();
		const p = createPerspective();
		const result = await p.analyze(
			"testing is for dummies",
			{
				TOXICITY: {},
			},
			{
				doNotStore: true,
			}
		);

		expect(result).toBeTruthy();
		expect(safeLookup("TOXICITY")(result.attributeScores)).toBeTruthy();

		// t.log(JSON.stringify(result, null, 2));
		// t.truthy(result);
		// t.truthy(safeLookup("TOXICITY")(result.attributeScores));
	});

	// This test will fail if the max length isn't what we expect
	test("integration:analyze with text too long", async () => {
		nock.enableNetConnect();
		const p = createPerspective();
		const text = repeat("x", 20481);

		try {
			await p.analyze(
				text,
				{
					TOXICITY: {},
				},
				{
					doNotStore: true,
				}
			);
		} catch (error) {
			expect(error).toBeTruthy();
			expect(error).toBeInstanceOf(TextTooLongError);
		}
	});
}
