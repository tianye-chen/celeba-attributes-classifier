from firebase_functions import https_fn, options
from flask import jsonify
import torch
from torch import nn
from PIL import Image
from torchvision import transforms
from torchvision.models import efficientnet_b0
import os

NUM_CLASSES = 40
IMAGE_DIM = 224

ATTRIBUTES = ['5_o_Clock_Shadow', 'Arched_Eyebrows', 'Attractive', 'Bags_Under_Eyes',
       'Bald', 'Bangs', 'Big_Lips', 'Big_Nose', 'Black_Hair', 'Blond_Hair',
       'Blurry', 'Brown_Hair', 'Bushy_Eyebrows', 'Chubby', 'Double_Chin',
       'Eyeglasses', 'Goatee', 'Gray_Hair', 'Heavy_Makeup', 'High_Cheekbones',
       'Male', 'Mouth_Slightly_Open', 'Mustache', 'Narrow_Eyes', 'No_Beard',
       'Oval_Face', 'Pale_Skin', 'Pointy_Nose', 'Receding_Hairline',
       'Rosy_Cheeks', 'Sideburns', 'Smiling', 'Straight_Hair', 'Wavy_Hair',
       'Wearing_Earrings', 'Wearing_Hat', 'Wearing_Lipstick',
       'Wearing_Necklace', 'Wearing_Necktie', 'Young']

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = efficientnet_b0(weights=None)
model.classifier[-1] = nn.Linear(model.classifier[-1].in_features, NUM_CLASSES)
model.classifier.append(nn.Sigmoid())

model_path = os.path.join(os.path.dirname(__file__), 'demo_model.h5')
model.load_state_dict(torch.load(model_path, map_location=device))

transform = transforms.Compose([
    transforms.Resize((IMAGE_DIM, IMAGE_DIM)),
    transforms.ToTensor()
])

def get_present_attrs(attr_list):
  present_attrs = []
  
  if type(attr_list) == torch.Tensor:
    attr_list = attr_list.tolist()

  for i in range(len(attr_list)):
    if attr_list[i] == 1.0:
      present_attrs.append(ATTRIBUTES[i])

  return present_attrs

def predict(image):
  model.eval()
  with torch.no_grad():
    image = image.convert('RGB')
    image = transform(image).to(device)
    image = image.unsqueeze(0)

    output = model(image)
    preds = torch.round(output)
    preds = preds[0]
    
    return get_present_attrs(preds)

@https_fn.on_request(cors=options.CorsOptions(cors_origins="*", cors_methods=["get, post"]))
def make_preds(req):
    file = req.files['image_file']
    
    if file:
      image = Image.open(file.stream)
      results = predict(image)
      
      print(f'{jsonify(results)}\n')
      
      return jsonify(results)