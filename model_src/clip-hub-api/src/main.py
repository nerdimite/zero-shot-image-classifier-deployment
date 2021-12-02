import os
from hub import hub_handler
# Add your own import statements
from inference import CLIPImageClassifier
from utils import convert_base64_to_image

# This environment variable gives you the
# path to the directory of your model. You
# can use this in your code to load model
# and other large files
MODEL_DIR = os.getenv("MODEL_DIR")
classifier = CLIPImageClassifier(os.path.join(MODEL_DIR, 'ViT-B-32.pt'))

@hub_handler
def inference_handler(inputs, _):
    '''The main inference function which gets triggered when the API is invoked'''
    
    image = convert_base64_to_image(inputs['image'], return_type='pillow')
    print(image)
    print(inputs['classes'])
    
    output = classifier.predict(image, inputs['classes'])

    return output
