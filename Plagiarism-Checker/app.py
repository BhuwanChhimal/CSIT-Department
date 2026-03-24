from __future__ import annotations

import math
import re
from collections import Counter

import streamlit as st

STOPWORDS = {
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
}
NGRAM_SIZES = (12, 10, 8, 6, 5)
SHINGLE_SIZE = 5


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def informative_count(tokens: list[str]) -> int:
    return sum(1 for token in tokens if len(token) > 1 and token not in STOPWORDS)


def make_ngram_counts(tokens: list[str], size: int, excluded: set[str] | None = None) -> Counter[str]:
    excluded = excluded or set()
    phrases: Counter[str] = Counter()
    for index in range(len(tokens) - size + 1):
        phrase_tokens = tokens[index:index + size]
        if informative_count(phrase_tokens) < math.ceil(size / 2):
            continue
        phrase = " ".join(phrase_tokens)
        if phrase in excluded:
            continue
        phrases[phrase] += 1
    return phrases


def cosine_similarity(left_tokens: list[str], right_tokens: list[str]) -> float:
    left_counts = Counter(token for token in left_tokens if len(token) > 1 and token not in STOPWORDS)
    right_counts = Counter(token for token in right_tokens if len(token) > 1 and token not in STOPWORDS)
    if not left_counts or not right_counts:
        return 0.0

    dot_product = sum(left_counts[token] * right_counts[token] for token in left_counts if token in right_counts)
    left_magnitude = math.sqrt(sum(value * value for value in left_counts.values()))
    right_magnitude = math.sqrt(sum(value * value for value in right_counts.values()))
    if left_magnitude == 0 or right_magnitude == 0:
        return 0.0
    return dot_product / (left_magnitude * right_magnitude)


def containment(left: set[str], right: set[str]) -> float:
    if not left or not right:
        return 0.0
    shared = len(left & right)
    return shared / min(len(left), len(right))


def sentence_set(text: str, prompt_sentences: set[str] | None = None) -> set[str]:
    prompt_sentences = prompt_sentences or set()
    candidates = re.split(r"[\n\r]+|(?<=[.!?])\s+", text)
    normalized = set()
    for candidate in candidates:
        sentence = re.sub(r"[^a-z0-9\s]", " ", candidate.lower())
        sentence = re.sub(r"\s+", " ", sentence).strip()
        if not sentence or len(sentence.split()) < 6 or sentence in prompt_sentences:
            continue
        normalized.add(sentence)
    return normalized


def evidence_phrases(
    left_tokens: list[str],
    right_tokens: list[str],
    prompt_phrase_sets: dict[int, set[str]],
) -> list[dict[str, int | str]]:
    results: list[dict[str, int | str]] = []
    seen: set[str] = set()

    for size in NGRAM_SIZES:
        left_counts = make_ngram_counts(left_tokens, size, prompt_phrase_sets.get(size, set()))
        right_counts = make_ngram_counts(right_tokens, size, prompt_phrase_sets.get(size, set()))
        for phrase, left_count in left_counts.items():
            right_count = right_counts.get(phrase)
            if not right_count or phrase in seen:
                continue
            if any(phrase in item["phrase"] or item["phrase"] in phrase for item in results):
                continue
            results.append(
                {
                    "phrase": phrase,
                    "word_count": size,
                    "left_occurrences": left_count,
                    "right_occurrences": right_count,
                }
            )
            seen.add(phrase)
            if len(results) >= 5:
                return results

    return results


def analyze(source_text: str, reference_text: str, prompt_text: str = "") -> dict:
    source = normalize_text(source_text)
    reference = normalize_text(reference_text)
    prompt = normalize_text(prompt_text)

    source_tokens = tokenize(source)
    reference_tokens = tokenize(reference)
    prompt_tokens = tokenize(prompt)

    prompt_phrase_sets = {
        size: set(make_ngram_counts(prompt_tokens, size).keys())
        for size in NGRAM_SIZES
    }

    source_shingles = set(make_ngram_counts(source_tokens, SHINGLE_SIZE, prompt_phrase_sets[SHINGLE_SIZE]).keys())
    reference_shingles = set(make_ngram_counts(reference_tokens, SHINGLE_SIZE, prompt_phrase_sets[SHINGLE_SIZE]).keys())
    lexical_cosine = cosine_similarity(source_tokens, reference_tokens)
    sentence_overlap = containment(
        sentence_set(source, sentence_set(prompt)),
        sentence_set(reference, sentence_set(prompt)),
    )
    phrases = evidence_phrases(source_tokens, reference_tokens, prompt_phrase_sets)
    longest_phrase = phrases[0]["word_count"] if phrases else 0

    score = (
        containment(source_shingles, reference_shingles) * 0.42
        + lexical_cosine * 0.28
        + sentence_overlap * 0.1
        + min(longest_phrase / 20, 1) * 0.2
    )

    if longest_phrase >= 8 and lexical_cosine >= 0.75:
        score += 0.08

    score = max(0.0, min(score, 1.0))
    percentage = round(score * 100, 1)

    if percentage >= 60:
        risk = "high"
    elif percentage >= 45:
        risk = "medium"
    elif percentage >= 25:
        risk = "review"
    else:
        risk = "low"

    return {
        "similarity_score": percentage,
        "risk": risk,
        "metrics": {
            "containment": round(containment(source_shingles, reference_shingles), 3),
            "lexical_cosine": round(lexical_cosine, 3),
            "sentence_overlap": round(sentence_overlap, 3),
            "longest_phrase_words": longest_phrase,
        },
        "evidence": phrases,
    }


st.set_page_config(page_title="Plagiarism Checker", layout="wide")
st.title("Plagiarism Checker")
st.caption(
    "Hybrid overlap scoring with prompt-aware phrase filtering. "
    "Use this standalone tool for direct text comparisons."
)

source_text = st.text_area("Source Text", height=220)
reference_text = st.text_area("Reference Text", height=220)
prompt_text = st.text_area(
    "Assignment Prompt (Optional)",
    height=120,
    help="Prompt wording is discounted before similarity is scored.",
)

if st.button("Analyze Similarity", use_container_width=True):
    if len(source_text.strip()) < 50 or len(reference_text.strip()) < 50:
        st.warning("Please provide at least 50 characters in both text fields.")
    else:
        result = analyze(source_text, reference_text, prompt_text)
        metric_columns = st.columns(4)
        metric_columns[0].metric("Similarity Score", f"{result['similarity_score']}%")
        metric_columns[1].metric("Risk Level", result["risk"].title())
        metric_columns[2].metric("Containment", result["metrics"]["containment"])
        metric_columns[3].metric(
            "Longest Phrase",
            f"{result['metrics']['longest_phrase_words']} words",
        )

        st.subheader("Evidence Phrases")
        if result["evidence"]:
            for phrase in result["evidence"]:
                st.write(f"- {phrase['phrase']}")
        else:
            st.info("No strong repeated phrases were found after prompt filtering.")
