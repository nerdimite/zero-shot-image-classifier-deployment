from PIL import Image
import numpy as np
import base64
from io import BytesIO

def convert_base64_to_image(image_str, return_type='numpy'):
    '''
    Converts a base64 encoded image to Pillow Image or Numpy Array
    
    Args:
        image_str (str): The pure base64 encoded string of the image
        return_type (str): The type of image you want to convert it to. 
                           Choices are [ numpy | pillow ]. Default is numpy.
    Returns:
        PIL.Image or numpy.array: The converted image
    '''
    image = Image.open(BytesIO(base64.b64decode(image_str)))
    if return_type == 'numpy':
        return np.array(image)
    else:
        return image

# Feel Free to add more of your own utilities here...