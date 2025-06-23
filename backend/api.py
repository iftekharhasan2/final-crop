from flask import Flask, request, jsonify
import pickle
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model
model = pickle.load(open('gb.pkl', 'rb'))

# Your mappings (example shortened)
zilla_mapping = {'Shariatpur': 0}
soil_type_mapping = {'Clay': 0, 'Clay Loam': 1, 'Loam': 2, 'Sandy': 3, 'Sandy Loam': 4}
# ... other mappings here ...

recommendation_mapping = {
    0: 'Cucumber (Fungal disease resistant)',
    1: 'Cucumber (Mildew resistant)',
    2: 'Cucumber (Virus & wilting resistant)',
    3: 'Cucumber (Virus resistant)',
    4: 'No_Cucumber'
}

upazila_mapping = {
    'Bhedarganj': 0,
    'Damudya': 1,
    'Gosairhat': 2,
    'Naria': 3,
    'Shariatpur Sadar': 4,
    'Zajira': 5
}

union_parishad_mapping = {
    'Alwalpur': 0, 'Angaria': 1, 'Bara Gopalpur': 2, 'Bara Krishnanagar': 3,
    'Barakandi': 4, 'Bhojeshwar': 5, 'Bhumkhara': 6, 'Bijhari': 7, 'Bilaspur': 8,
    'Binodpur': 9, 'Chamta': 10, 'Chandrapur': 11, 'Char Atra': 12,
    'Chikandi': 13, 'Chitalia': 14, 'Darul Aman': 15, 'Dhanokathi': 16,
    'Dingamanik': 17, 'Domsar': 18, 'Fateh Jangpur': 19, 'Gharisar': 20,
    'Gosairhat': 21, 'Idilpur': 22, 'Islampur': 23, 'Japsa': 24, 'Joynagar': 25,
    'Kedarpur': 26, 'Kodalpur': 27, 'Koneshwar': 28, 'Kuchaipatti': 29,
    'Kunder Char': 30, 'Mahmudpur': 31, 'Muktarer Char': 32, 'Mulna': 33,
    'Nager Patti': 34, 'Nalmuri': 35, 'Naodoba': 36, 'Nasason': 37,
    'Noapara': 38, 'Paler Char': 39, 'Palong': 40, 'Purba Naodoba': 41,
    'Purbo Damudya': 42, 'Rajnagar': 43, 'Rudrakar': 44, 'Samantasar': 45,
    'Sener Char': 46, 'Shaul Para': 47, 'Shidul Kura': 48, 'Sidda': 49,
    'Tarabunia': 50, 'Tulasar': 51, 'Zajira': 52
}

season_mapping = {
    'Rabi': 0
}

irrigation_mapping = {
    'Bad': 0, 'Good': 1, 'Medium': 2, 'Very Bad': 3, 'Very Good': 4
}

drainage_mapping = {
    'Bad': 0, 'Good': 1, 'Low': 2, 'Medium': 3,
    'Very Bad': 4, 'Very Good': 5, 'Very Low': 6
}

insect_infestation_mapping = {
    'High': 0, 'Low': 1, 'Medium': 2, 'Very High': 3, 'Very Low': 4
}

diseases_mapping = {
    'High': 0, 'Low': 1, 'Medium': 2, 'Very High': 3, 'Very Low': 4
}

last_season_crop_mapping = {
    'Mustard': 0, 'No_data': 1, 'Rice': 2
}


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    # Map string inputs to integers
    mapped_data = {
        'Zilla': zilla_mapping.get(data.get('Zilla'), -1),
        'Upazila': upazila_mapping.get(data.get('Upazila'), -1),
        'Union Parishad': union_parishad_mapping.get(data.get('Union Parishad'), -1),
        'Soil Type': soil_type_mapping.get(data.get('Soil Type'), -1),
        'Season': season_mapping.get(data.get('Season'), -1),
        'Irrigation': irrigation_mapping.get(data.get('Irrigation'), -1),
        'Drainage': drainage_mapping.get(data.get('Drainage'), -1),
        'Insect infestation': insect_infestation_mapping.get(data.get('Insect infestation'), -1),
        'Diseases': diseases_mapping.get(data.get('Diseases'), -1),
        'Last Season Crop': last_season_crop_mapping.get(data.get('Last Season Crop'), -1),
        'Area': int(data.get('Area', 0))  # Area might be numeric input
    }

    # Check if any mapping failed (-1 means unknown)
    if any(v == -1 for v in mapped_data.values()):
        return jsonify({'error': 'Invalid input category detected'}), 400
    
    df = pd.DataFrame([mapped_data])
    pred_code = model.predict(df)[0]
    print(pred_code)
    pred_text = recommendation_mapping.get(pred_code, 'Unknown Recommendation')

    return jsonify({'prediction_code': int(pred_code), 'prediction_text': pred_text})

if __name__ == '__main__':
    app.run(port=5000)
