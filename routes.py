from flask import Blueprint, request, jsonify
from .openai_handler import get_openai_response
from .dataset_handler import get_dataset_response

main_bp = Blueprint('main', __name__)

@main_bp.route('/assist', methods=['POST'])
def assist():
    user_input = request.json.get('query')
    
    # First, try to get a response from the custom dataset
    dataset_response = get_dataset_response(user_input)
    
    if dataset_response:
        return jsonify({'response': dataset_response})
    
    # If no response from dataset, fallback to OpenAI API
    openai_response = get_openai_response(user_input)
    
    return jsonify({'response': openai_response})
