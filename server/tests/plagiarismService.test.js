import test from "node:test";
import assert from "node:assert/strict";

import {
  analyzeTextPair,
  buildAssignmentPlagiarismReport,
  extractTextFromBuffer,
  validateManualComparisonInput,
} from "../services/plagiarismService.js";

const assignmentPrompt = `
Explain database normalization and describe first normal form, second normal form,
and third normal form with practical examples.
`;

const copiedSubmissionA = `
Database normalization reduces redundancy and improves data integrity in a relational schema.
First normal form removes repeating groups and forces atomic columns.
Second normal form removes partial dependency by making every non-key attribute depend on the whole key.
Third normal form removes transitive dependency so derived facts are stored only once.
This process improves consistency, simplifies updates, and lowers the risk of conflicting rows.
`;

const copiedSubmissionB = `
Database normalization reduces redundancy and improves data integrity in relational databases.
First normal form removes repeating groups and keeps every column atomic.
Second normal form removes partial dependency so each non-key attribute depends on the whole key.
Third normal form removes transitive dependency and stores each fact only once.
This process improves consistency, simplifies updates, and lowers the chance of conflicting rows.
`;

const unrelatedSubmission = `
An operating system manages hardware resources, schedules processes, and provides system calls.
Process scheduling helps the CPU share time between competing tasks efficiently.
Memory management keeps active programs isolated and allocates space when applications request it.
File systems organize persistent data while device drivers allow software to communicate with hardware.
`;

test("prompt-aware analysis keeps prompt-only overlap from dominating the score", () => {
  const left = `${assignmentPrompt}\n${unrelatedSubmission}`;
  const right = `${assignmentPrompt}\nAnother student should discuss indexing strategies, transaction logs, and recovery plans in a different way without copying complete passages from the prompt.`;

  const result = analyzeTextPair(left, right, { promptText: assignmentPrompt });

  assert.ok(result.similarityScore < 25, `expected low similarity, got ${result.similarityScore}`);
});

test("analysis flags highly similar submissions and returns evidence phrases", () => {
  const result = analyzeTextPair(copiedSubmissionA, copiedSubmissionB, {
    promptText: assignmentPrompt,
  });

  assert.ok(result.similarityScore >= 60, `expected strong similarity, got ${result.similarityScore}`);
  assert.equal(result.riskLevel, "high");
  assert.ok(result.evidencePhrases.length > 0);
  assert.ok(result.metrics.longestSharedPhraseWords >= 5);
});

test("assignment report sorts suspicious pairs ahead of unrelated pairs", () => {
  const report = buildAssignmentPlagiarismReport({
    assignment: {
      id: "assignment-1",
      title: "Normalization Essay",
      subject: "DBMS",
    },
    promptText: assignmentPrompt,
    submissions: [
      {
        submissionId: "sub-a",
        student: { id: "a", name: "Alice", email: "a@example.com" },
        fileName: "alice.txt",
        fileUrl: "uploads/submissions/alice.txt",
        extraction: { status: "ready", reason: null, truncated: false },
        text: copiedSubmissionA,
        wordCount: copiedSubmissionA.split(/\s+/).length,
        characterCount: copiedSubmissionA.length,
      },
      {
        submissionId: "sub-b",
        student: { id: "b", name: "Bob", email: "b@example.com" },
        fileName: "bob.txt",
        fileUrl: "uploads/submissions/bob.txt",
        extraction: { status: "ready", reason: null, truncated: false },
        text: copiedSubmissionB,
        wordCount: copiedSubmissionB.split(/\s+/).length,
        characterCount: copiedSubmissionB.length,
      },
      {
        submissionId: "sub-c",
        student: { id: "c", name: "Cara", email: "c@example.com" },
        fileName: "cara.txt",
        fileUrl: "uploads/submissions/cara.txt",
        extraction: { status: "ready", reason: null, truncated: false },
        text: unrelatedSubmission,
        wordCount: unrelatedSubmission.split(/\s+/).length,
        characterCount: unrelatedSubmission.length,
      },
    ],
  });

  assert.equal(report.summary.pairCount, 3);
  assert.equal(report.pairs[0].left.student.name, "Alice");
  assert.equal(report.pairs[0].right.student.name, "Bob");
  assert.ok(report.pairs[0].similarityScore > report.pairs[1].similarityScore);
  assert.ok(report.summary.highestSimilarity >= 60);
});

test("manual comparison validation rejects short inputs", () => {
  assert.throws(
    () =>
      validateManualComparisonInput({
        sourceText: "short",
        referenceText: "also short",
      }),
    /Manual comparison input is invalid/
  );
});

test("plain text extraction reads supported text buffers", async () => {
  const result = await extractTextFromBuffer({
    buffer: Buffer.from("One line.\nAnother line."),
    fileName: "essay.txt",
    fileType: "text/plain",
  });

  assert.equal(result, "One line. Another line.");
});
