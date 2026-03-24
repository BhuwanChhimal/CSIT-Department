import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import mammoth from "mammoth";
import * as pdfParseModule from "pdf-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SERVER_ROOT = path.resolve(__dirname, "..");

const MAX_EXTRACTED_CHARACTERS = 120000;
const SHINGLE_SIZE = 5;
const FINGERPRINT_WINDOW_SIZE = 4;
const EVIDENCE_NGRAM_SIZES = [12, 10, 8, 6, 5];
const SENTENCE_MIN_WORDS = 6;
const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "has",
  "have",
  "he",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "there",
  "these",
  "this",
  "to",
  "was",
  "were",
  "will",
  "with",
  "you",
  "your",
]);

const PLAIN_TEXT_EXTENSIONS = new Set([
  ".txt",
  ".md",
  ".markdown",
  ".csv",
  ".json",
  ".xml",
  ".html",
  ".htm",
  ".svg",
  ".css",
  ".scss",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".java",
  ".c",
  ".cpp",
  ".cc",
  ".h",
  ".hpp",
  ".sql",
  ".r",
  ".go",
  ".rb",
  ".php",
  ".sh",
  ".yml",
  ".yaml",
]);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const roundTo = (value, digits = 3) =>
  Number.parseFloat(Number(value).toFixed(digits));
const PDFParse = pdfParseModule.PDFParse;

export class PlagiarismAnalysisError extends Error {
  constructor(message, details = [], statusCode = 400) {
    super(message);
    this.name = "PlagiarismAnalysisError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

const sanitizeWhitespace = (text) =>
  text.replace(/\u0000/g, " ").replace(/\s+/g, " ").trim();

const normalizeSentence = (text) =>
  text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (text) =>
  text
    .toLowerCase()
    .normalize("NFKC")
    .match(/[a-z0-9]+/g) || [];

const countNonStopwords = (tokens) =>
  tokens.reduce(
    (count, token) => count + (STOPWORDS.has(token) || token.length <= 1 ? 0 : 1),
    0
  );

const isInformativeToken = (token) =>
  token.length > 1 && !STOPWORDS.has(token);

const createTermCounts = (tokens) => {
  const counts = new Map();
  tokens.forEach((token) => {
    if (!isInformativeToken(token)) {
      return;
    }

    counts.set(token, (counts.get(token) || 0) + 1);
  });
  return counts;
};

const cosineSimilarity = (leftCounts, rightCounts) => {
  if (leftCounts.size === 0 || rightCounts.size === 0) {
    return 0;
  }

  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (const value of leftCounts.values()) {
    leftMagnitude += value * value;
  }

  for (const value of rightCounts.values()) {
    rightMagnitude += value * value;
  }

  for (const [token, leftValue] of leftCounts.entries()) {
    const rightValue = rightCounts.get(token);
    if (rightValue) {
      dotProduct += leftValue * rightValue;
    }
  }

  if (leftMagnitude === 0 || rightMagnitude === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
};

const createNgramMap = (tokens, size, excludedPhrases = new Set()) => {
  const counts = new Map();

  if (tokens.length < size) {
    return counts;
  }

  for (let index = 0; index <= tokens.length - size; index += 1) {
    const phraseTokens = tokens.slice(index, index + size);
    if (countNonStopwords(phraseTokens) < Math.ceil(size / 2)) {
      continue;
    }

    const phrase = phraseTokens.join(" ");
    if (excludedPhrases.has(phrase)) {
      continue;
    }

    const current = counts.get(phrase) || {
      count: 0,
      firstIndex: index,
      size,
    };
    current.count += 1;
    counts.set(phrase, current);
  }

  return counts;
};

const jaccardSimilarity = (leftSet, rightSet) => {
  const union = new Set([...leftSet, ...rightSet]);
  if (union.size === 0) {
    return 0;
  }

  let intersectionCount = 0;
  for (const value of leftSet) {
    if (rightSet.has(value)) {
      intersectionCount += 1;
    }
  }

  return intersectionCount / union.size;
};

const containmentScore = (leftSet, rightSet) => {
  const smallerSize = Math.min(leftSet.size, rightSet.size);
  if (smallerSize === 0) {
    return 0;
  }

  let shared = 0;
  for (const value of leftSet) {
    if (rightSet.has(value)) {
      shared += 1;
    }
  }

  return shared / smallerSize;
};

const hashString = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const buildFingerprints = (tokens, excludedPhrases = new Set()) => {
  const shingles = Array.from(
    createNgramMap(tokens, SHINGLE_SIZE, excludedPhrases).entries()
  ).map(([phrase, metadata]) => ({
    phrase,
    hash: hashString(phrase),
    index: metadata.firstIndex,
  }));

  if (shingles.length <= FINGERPRINT_WINDOW_SIZE) {
    return new Set(shingles.map((item) => item.phrase));
  }

  const selected = new Map();

  for (
    let windowStart = 0;
    windowStart <= shingles.length - FINGERPRINT_WINDOW_SIZE;
    windowStart += 1
  ) {
    const window = shingles.slice(
      windowStart,
      windowStart + FINGERPRINT_WINDOW_SIZE
    );
    let chosen = window[0];

    for (const candidate of window) {
      if (
        candidate.hash < chosen.hash ||
        (candidate.hash === chosen.hash && candidate.index > chosen.index)
      ) {
        chosen = candidate;
      }
    }

    selected.set(`${chosen.hash}:${chosen.index}`, chosen.phrase);
  }

  return new Set(selected.values());
};

const sentenceSetFromText = (text, promptSentenceSet = new Set()) => {
  const candidates = text
    .split(/[\n\r]+|(?<=[.!?])\s+/)
    .map((sentence) => normalizeSentence(sentence))
    .filter(Boolean)
    .filter((sentence) => sentence.split(" ").length >= SENTENCE_MIN_WORDS)
    .filter((sentence) => !promptSentenceSet.has(sentence));

  return new Set(candidates);
};

const pickEvidencePhrases = (
  leftTokens,
  rightTokens,
  promptPhraseSets = new Map()
) => {
  const evidence = [];
  const seen = new Set();

  for (const size of EVIDENCE_NGRAM_SIZES) {
    const excludedPromptPhrases = promptPhraseSets.get(size) || new Set();
    const leftMap = createNgramMap(leftTokens, size, excludedPromptPhrases);
    const rightMap = createNgramMap(rightTokens, size, excludedPromptPhrases);

    for (const [phrase, leftMetadata] of leftMap.entries()) {
      const rightMetadata = rightMap.get(phrase);
      if (!rightMetadata || seen.has(phrase)) {
        continue;
      }

      const overlap = evidence.some(
        (item) =>
          item.phrase.includes(phrase) ||
          phrase.includes(item.phrase) ||
          phrasesHeavilyOverlap(item.phrase, phrase)
      );
      if (overlap) {
        continue;
      }

      evidence.push({
        phrase,
        wordCount: size,
        leftOccurrences: leftMetadata.count,
        rightOccurrences: rightMetadata.count,
      });
      seen.add(phrase);

      if (evidence.length >= 5) {
        return evidence;
      }
    }
  }

  return evidence;
};

const determineRiskLevel = (score) => {
  if (score >= 60) {
    return "high";
  }
  if (score >= 45) {
    return "medium";
  }
  if (score >= 25) {
    return "review";
  }
  return "low";
};

const buildPromptPhraseSets = (promptTokens) => {
  const promptPhraseSets = new Map();
  for (const size of EVIDENCE_NGRAM_SIZES) {
    promptPhraseSets.set(size, new Set(createNgramMap(promptTokens, size).keys()));
  }
  return promptPhraseSets;
};

const phrasesHeavilyOverlap = (leftPhrase, rightPhrase) => {
  const leftTokens = new Set(leftPhrase.split(" "));
  const rightTokens = new Set(rightPhrase.split(" "));
  const intersection = [...leftTokens].filter((token) => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  return union > 0 && intersection / union >= 0.6;
};

export const createAnalyzableText = (text, label = "Document") => {
  const safeText = sanitizeWhitespace(text || "");
  const tokens = tokenize(safeText);
  return {
    label,
    rawText: safeText,
    tokens,
    tokenCount: tokens.length,
    wordCount: tokens.length,
    characterCount: safeText.length,
  };
};

export const analyzeTextPair = (
  leftText,
  rightText,
  options = {}
) => {
  const left = typeof leftText === "string" ? createAnalyzableText(leftText) : leftText;
  const right =
    typeof rightText === "string" ? createAnalyzableText(rightText) : rightText;
  const prompt = options.promptText
    ? createAnalyzableText(options.promptText, "Assignment Prompt")
    : createAnalyzableText("", "Assignment Prompt");

  const promptPhraseSets = buildPromptPhraseSets(prompt.tokens);
  const leftShingles = new Set(
    createNgramMap(left.tokens, SHINGLE_SIZE, promptPhraseSets.get(SHINGLE_SIZE)).keys()
  );
  const rightShingles = new Set(
    createNgramMap(right.tokens, SHINGLE_SIZE, promptPhraseSets.get(SHINGLE_SIZE)).keys()
  );
  const leftFingerprints = buildFingerprints(
    left.tokens,
    promptPhraseSets.get(SHINGLE_SIZE)
  );
  const rightFingerprints = buildFingerprints(
    right.tokens,
    promptPhraseSets.get(SHINGLE_SIZE)
  );
  const promptSentenceSet = sentenceSetFromText(prompt.rawText);
  const leftSentences = sentenceSetFromText(left.rawText, promptSentenceSet);
  const rightSentences = sentenceSetFromText(right.rawText, promptSentenceSet);

  const fingerprintJaccard = jaccardSimilarity(leftFingerprints, rightFingerprints);
  const shingleContainment = containmentScore(leftShingles, rightShingles);
  const lexicalCosine = cosineSimilarity(
    createTermCounts(left.tokens),
    createTermCounts(right.tokens)
  );
  const sentenceOverlap = containmentScore(leftSentences, rightSentences);
  const evidencePhrases = pickEvidencePhrases(
    left.tokens,
    right.tokens,
    promptPhraseSets
  );
  const longestSharedPhraseWords = evidencePhrases[0]?.wordCount || 0;

  let score =
    fingerprintJaccard * 0.22 +
    shingleContainment * 0.34 +
    lexicalCosine * 0.22 +
    sentenceOverlap * 0.08 +
    Math.min(longestSharedPhraseWords / 20, 1) * 0.14;

  if (longestSharedPhraseWords >= 10 && sentenceOverlap >= 0.15) {
    score += 0.08;
  }

  if (longestSharedPhraseWords >= 8 && lexicalCosine >= 0.75) {
    score += 0.1;
  }

  if (shingleContainment >= 0.55 && fingerprintJaccard >= 0.35) {
    score += 0.06;
  }

  if (shingleContainment >= 0.35 && fingerprintJaccard >= 0.15) {
    score += 0.08;
  }

  if (Math.min(left.tokenCount, right.tokenCount) < 40) {
    score *= 0.94;
  }

  const similarityScore = roundTo(clamp(score * 100, 0, 100), 1);

  return {
    similarityScore,
    riskLevel: determineRiskLevel(similarityScore),
    metrics: {
      fingerprintJaccard: roundTo(fingerprintJaccard),
      shingleContainment: roundTo(shingleContainment),
      lexicalCosine: roundTo(lexicalCosine),
      sentenceOverlap: roundTo(sentenceOverlap),
      longestSharedPhraseWords,
      sharedFingerprints: [...leftFingerprints].filter((value) =>
        rightFingerprints.has(value)
      ).length,
      sharedSentences: [...leftSentences].filter((value) =>
        rightSentences.has(value)
      ).length,
    },
    evidencePhrases,
    comparedLengths: {
      leftWords: left.wordCount,
      rightWords: right.wordCount,
      promptWords: prompt.wordCount,
    },
  };
};

export const summarizeRiskBreakdown = (pairs) =>
  pairs.reduce(
    (summary, pair) => {
      summary[pair.riskLevel] += 1;
      return summary;
    },
    { high: 0, medium: 0, review: 0, low: 0 }
  );

export const buildAssignmentPlagiarismReport = ({
  assignment,
  promptText = "",
  submissions,
}) => {
  const supportedSubmissions = submissions.filter(
    (submission) => submission.extraction.status === "ready"
  );
  const skippedSubmissions = submissions.filter(
    (submission) => submission.extraction.status !== "ready"
  );
  const pairs = [];

  for (let leftIndex = 0; leftIndex < supportedSubmissions.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < supportedSubmissions.length;
      rightIndex += 1
    ) {
      const left = supportedSubmissions[leftIndex];
      const right = supportedSubmissions[rightIndex];
      const pairAnalysis = analyzeTextPair(left.text, right.text, { promptText });

      pairs.push({
        pairId: `${left.submissionId}:${right.submissionId}`,
        similarityScore: pairAnalysis.similarityScore,
        riskLevel: pairAnalysis.riskLevel,
        metrics: pairAnalysis.metrics,
        evidencePhrases: pairAnalysis.evidencePhrases,
        left: {
          submissionId: left.submissionId,
          student: left.student,
          fileName: left.fileName,
          fileUrl: left.fileUrl,
        },
        right: {
          submissionId: right.submissionId,
          student: right.student,
          fileName: right.fileName,
          fileUrl: right.fileUrl,
        },
      });
    }
  }

  pairs.sort((left, right) => right.similarityScore - left.similarityScore);
  const riskBreakdown = summarizeRiskBreakdown(pairs);

  return {
    assignment: {
      id: assignment._id?.toString?.() || assignment.id,
      title: assignment.title,
      subject: assignment.subject,
      submissionCount: submissions.length,
      analyzedSubmissionCount: supportedSubmissions.length,
      skippedSubmissionCount: skippedSubmissions.length,
    },
    summary: {
      pairCount: pairs.length,
      highestSimilarity: pairs[0]?.similarityScore || 0,
      flaggedPairsCount: pairs.filter((pair) => pair.similarityScore >= 25).length,
      riskBreakdown,
    },
    prompt: {
      characterCount: promptText.length,
      wordCount: tokenize(promptText).length,
      usedForFiltering: Boolean(promptText.trim()),
    },
    submissions: submissions.map((submission) => ({
      submissionId: submission.submissionId,
      student: submission.student,
      fileName: submission.fileName,
      fileUrl: submission.fileUrl,
      extraction: submission.extraction,
      wordCount: submission.wordCount,
      characterCount: submission.characterCount,
    })),
    pairs,
  };
};

const resolveStoredPath = (fileUrl) => {
  if (!fileUrl) {
    return null;
  }

  return path.isAbsolute(fileUrl) ? fileUrl : path.resolve(SERVER_ROOT, fileUrl);
};

export const extractTextFromBuffer = async ({
  buffer,
  fileName = "",
  fileType = "",
}) => {
  const extension = path.extname(fileName || "").toLowerCase();
  const normalizedType = (fileType || "").toLowerCase();

  if (
    normalizedType === "application/pdf" ||
    extension === ".pdf"
  ) {
    const parser = new PDFParse({ data: buffer });
    try {
      const pdfData = await parser.getText();
      return sanitizeWhitespace(pdfData.text || "");
    } finally {
      await parser.destroy();
    }
  }

  if (
    normalizedType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === ".docx"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return sanitizeWhitespace(result.value || "");
  }

  if (PLAIN_TEXT_EXTENSIONS.has(extension) || normalizedType.startsWith("text/")) {
    return sanitizeWhitespace(buffer.toString("utf-8"));
  }

  throw new PlagiarismAnalysisError("Unsupported file format for text extraction.", [
    {
      field: "file",
      message: `Files of type ${extension || normalizedType || "unknown"} are not currently supported.`,
    },
  ]);
};

export const extractStoredSubmissionText = async ({
  fileUrl,
  fileName,
  fileType,
}) => {
  if (!fileUrl) {
    return {
      status: "unavailable",
      reason: "Missing file path.",
      text: "",
      wordCount: 0,
      characterCount: 0,
    };
  }

  const absolutePath = resolveStoredPath(fileUrl);

  try {
    const buffer = await fs.readFile(absolutePath);
    let text = await extractTextFromBuffer({
      buffer,
      fileName: fileName || path.basename(fileUrl),
      fileType,
    });
    let truncated = false;

    if (text.length > MAX_EXTRACTED_CHARACTERS) {
      text = text.slice(0, MAX_EXTRACTED_CHARACTERS);
      truncated = true;
    }

    const analyzable = createAnalyzableText(text);

    if (analyzable.wordCount < 20) {
      return {
        status: "too_short",
        reason: "Extracted text is too short for reliable analysis.",
        text,
        wordCount: analyzable.wordCount,
        characterCount: analyzable.characterCount,
        truncated,
      };
    }

    return {
      status: "ready",
      reason: truncated
        ? "Text was truncated to keep analysis performant."
        : null,
      text,
      wordCount: analyzable.wordCount,
      characterCount: analyzable.characterCount,
      truncated,
    };
  } catch (error) {
    if (error instanceof PlagiarismAnalysisError) {
      return {
        status: "unsupported",
        reason: error.details[0]?.message || error.message,
        text: "",
        wordCount: 0,
        characterCount: 0,
      };
    }

    return {
      status: "error",
      reason: "Unable to read and extract text from this submission.",
      text: "",
      wordCount: 0,
      characterCount: 0,
    };
  }
};

export const validateManualComparisonInput = (payload = {}) => {
  const errors = [];
  const sourceText = sanitizeWhitespace(payload.sourceText || "");
  const referenceText = sanitizeWhitespace(payload.referenceText || "");
  const assignmentPromptText = sanitizeWhitespace(payload.assignmentPromptText || "");

  if (sourceText.length < 50) {
    errors.push({
      field: "sourceText",
      message: "Source text must contain at least 50 characters.",
    });
  }

  if (referenceText.length < 50) {
    errors.push({
      field: "referenceText",
      message: "Reference text must contain at least 50 characters.",
    });
  }

  if (errors.length > 0) {
    throw new PlagiarismAnalysisError(
      "Manual comparison input is invalid.",
      errors
    );
  }

  return {
    sourceText,
    referenceText,
    assignmentPromptText,
  };
};
