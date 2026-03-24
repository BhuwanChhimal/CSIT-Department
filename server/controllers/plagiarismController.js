import Assignment from "../models/Assignment.js";
import {
  PlagiarismAnalysisError,
  analyzeTextPair,
  buildAssignmentPlagiarismReport,
  extractStoredSubmissionText,
  validateManualComparisonInput,
} from "../services/plagiarismService.js";

const getAssignmentPromptText = async (assignment) => {
  const promptPieces = [assignment.description].filter(Boolean);
  const assignmentFileExtraction = await extractStoredSubmissionText({
    fileUrl: assignment.fileUrl,
    fileName: assignment.fileName,
    fileType: assignment.fileType,
  });

  if (assignmentFileExtraction.status === "ready") {
    promptPieces.push(assignmentFileExtraction.text);
  }

  return promptPieces.join("\n\n").trim();
};

export const getAssignmentPlagiarismReport = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId)
      .populate("teacher", "name email")
      .populate("submissions.student", "name email");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    if (assignment.teacher._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to analyze submissions for this assignment.",
      });
    }

    const promptText = await getAssignmentPromptText(assignment);
    const submissions = await Promise.all(
      assignment.submissions.map(async (submission) => {
        const extraction = await extractStoredSubmissionText({
          fileUrl: submission.fileUrl,
          fileName: submission.fileName,
          fileType: submission.fileType,
        });

        return {
          submissionId: submission._id?.toString?.() || `${submission.student?._id}`,
          student: {
            id: submission.student?._id?.toString?.() || null,
            name: submission.student?.name || "Unknown Student",
            email: submission.student?.email || "",
          },
          fileName: submission.fileName || "Unnamed submission",
          fileUrl: submission.fileUrl,
          extraction: {
            status: extraction.status,
            reason: extraction.reason,
            truncated: extraction.truncated || false,
          },
          text: extraction.text,
          wordCount: extraction.wordCount,
          characterCount: extraction.characterCount,
        };
      })
    );

    const report = buildAssignmentPlagiarismReport({
      assignment,
      promptText,
      submissions,
    });

    res.json(report);
  } catch (error) {
    console.error("Plagiarism assignment analysis failed:", error);
    res.status(500).json({
      message: "Unable to generate the plagiarism report right now.",
    });
  }
};

export const compareTextsForPlagiarism = async (req, res) => {
  try {
    const { sourceText, referenceText, assignmentPromptText } =
      validateManualComparisonInput(req.body ?? {});
    const result = analyzeTextPair(sourceText, referenceText, {
      promptText: assignmentPromptText,
    });

    res.json({
      ...result,
      promptApplied: Boolean(assignmentPromptText),
    });
  } catch (error) {
    if (error instanceof PlagiarismAnalysisError) {
      return res.status(error.statusCode).json({
        message: error.message,
        errors: error.details,
      });
    }

    console.error("Manual plagiarism comparison failed:", error);
    return res.status(500).json({
      message: "Unable to compare the provided texts right now.",
    });
  }
};
