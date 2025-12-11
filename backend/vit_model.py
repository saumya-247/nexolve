import os
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification

BASE_DIR = os.path.dirname(os.path.abspath(__file__))     # backend/
MODEL_PATH = os.path.join(BASE_DIR, "models", "vit_finetuned")

# Add local_files_only=True to avoid HuggingFace Hub validation errors
processor = AutoImageProcessor.from_pretrained(MODEL_PATH, local_files_only=True)
model = AutoModelForImageClassification.from_pretrained(MODEL_PATH, local_files_only=True)

# Move to GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()

def predict_vit(pil_image):
    inputs = processor(images=pil_image, return_tensors="pt")
    # Move inputs to same device as model
    inputs = {k: v.to(device) for k, v in inputs.items()}
    
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=-1)[0]
    
    return float(probs[1])
