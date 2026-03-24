# Plagiarism Checker

This module now uses a hybrid plagiarism heuristic instead of the old perplexity-based AI-text detector.

What changed:
- Compares two texts using phrase containment, lexical cosine similarity, sentence overlap, and longest shared phrase length.
- Supports prompt-aware filtering so copied assignment wording does not dominate the score.
- Aligns with the same overlap-focused approach used by the main Express + React app.

Standalone usage:
1. Install the dependencies from `requirements.txt`.
2. Run `streamlit run app.py`.
3. Paste a source text, a reference text, and optionally the assignment prompt.

For production use inside the college portal, prefer the integrated teacher dashboard plagiarism report, which analyzes real assignment submissions and returns ranked suspicious pairs with evidence phrases.
