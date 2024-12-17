import pandas as pd

# Load the dataset (only once when the module is loaded)
dataset = pd.read_csv('dataset/windows_assistance.csv')

def get_dataset_response(user_input):
    # Search for user input in the dataset
    match = dataset[dataset['query'].str.contains(user_input, case=False)]
    
    if not match.empty:
        return match.iloc[0]['response']
    return None
