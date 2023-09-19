import spacy

# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")

def parse_user_input(user_input):
    # Process user input with spaCy
    doc = nlp(user_input)
    
    # Initialize variables to store extracted information
    count = None
    filter_criteria = None
    dataset = None
    
    # Extract entities and intent
    for token in doc:
        if token.ent_type_ == "CARDINAL":
            count = int(token.text)
        elif token.ent_type_ == "DATE":
            filter_criteria = token.text
        elif token.ent_type_ == "GPE":  # Assuming dataset names are recognized as geopolitical entities
            dataset = token.text
    
    return count, filter_criteria, dataset

# Example user input
user_input = "Give 2018 me 10 invoices from the invoices dataset that are before "
count, filter_criteria, dataset = parse_user_input(user_input)

# Validation and query building logic can be added here

# Print extracted information
print(f"Count: {count}")
print(f"Filter Criteria: {filter_criteria}")
print(f"Dataset: {dataset}")
