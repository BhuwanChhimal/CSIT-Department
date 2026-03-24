from app import analyze

PROMPT = "Explain database normalization and discuss first, second, and third normal form."

LEFT = """
Database normalization reduces redundancy and improves data integrity.
First normal form removes repeating groups and keeps each value atomic.
Second normal form removes partial dependency on composite keys.
Third normal form removes transitive dependency and stores each fact once.
"""

RIGHT = """
Database normalization reduces redundancy and improves data integrity in a schema.
First normal form removes repeating groups and makes each attribute atomic.
Second normal form removes partial dependency from composite keys.
Third normal form removes transitive dependency so facts are stored only once.
"""


if __name__ == "__main__":
    print(analyze(LEFT, RIGHT, PROMPT))
