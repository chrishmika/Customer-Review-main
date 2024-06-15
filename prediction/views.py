from django.shortcuts import render, get_object_or_404, redirect
from pathlib import Path
from django.http import JsonResponse
import os
import tensorflow as tf
import numpy as np
import re
import spacy
import pickle
import json
from .models import Item

BASE_DIR = Path(__file__).resolve().parent.parent

with open(os.path.join(BASE_DIR, 'artifacts/models/stop_word_edit.pkl'),'rb') as f:
    STOP_WORDS_EDIT = pickle.load(f) 

nn_model = tf.keras.models.load_model(os.path.join(BASE_DIR, 'artifacts/models/nn_model.h5'))

nlp = spacy.load(os.path.join(BASE_DIR, 'artifacts/models/spacy_model'))

def clear_text(text):
    doc = nlp(str(text))
    clear = ""
    for i in doc:
        if i.like_email or i.like_url or i.is_punct or i.is_currency or i.like_num or i.text in STOP_WORDS_EDIT:
            continue
        i = i.lemma_
        i = i.lower()
        i = re.sub("[^a-zA-Z\s']", '', i)
        clear =clear +  i+" "
    clear = nlp(clear).vector
    return clear
 
def get_pred(predicted):
    predicted = np.argmax(predicted[0])
    if predicted == 1:
        return 'Positive'
    else:
        return 'Negative'

def prediction(text):
    text = clear_text(text)
    y_pred = nn_model.predict(text.reshape(1,300))
    y_pred = get_pred(y_pred)
    return y_pred




def index(request):
    items = Item.objects.all()
    item_data = []
    for item in items:
        item_data.append({
            'id': item.id,
            'itemName': item.itemName,
            'imageUrl': item.imageUrl,
            'description': item.description,
            'commentCount': item.commentCount,
            'reviewInfo': item.reviewInfo,
        })
    item_data_json = json.dumps(item_data)
    return render(request, 'index.html', {'item_data_json': item_data_json})

def submit_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        item_id = data.get('itemId')
        comment = data.get('commentTxt')
        review_ran = str(data.get('rangeVal'))


        pred = prediction(comment)

        if int(review_ran) >= 50 and pred == 'Positive':
            predval = 'Positive'
        else:
            predval = 'Negative'

        item = Item.objects.get(id=item_id)
        item.commentCount += 1

        review_info = item.reviewInfo
        review_info.append({
            'commentTxt': comment,
            'value': review_ran,
            'sentiment': pred, 
        })

        item.save()

        return JsonResponse({'message': 'sucsses'})
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)