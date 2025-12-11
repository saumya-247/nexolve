# main.py
import io
import os
import base64
import tempfile
import numpy as np
from PIL import Image
import imageio.v3 as iio
import json
import sys

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from vit_model import predict_vit

app = FastAPI(title="Deepfake Detection Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def frame_to_base64(frame_rgb):
    """Convert RGB numpy frame → Base64."""
    pil = Image.fromarray(frame_rgb.astype("uint8"))
    buf = io.BytesIO()
    pil.save(buf, format="JPEG")
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), sample_fps: float = 1.0):
    print(f"\n🔍 REQUEST RECEIVED - Filename: {file.filename}", flush=True)
    
    filename = file.filename.lower()
    content = await file.read()
    print(f"📦 Content read: {len(content)} bytes", flush=True)

    # ---------------- IMAGE ----------------
    if filename.endswith((".jpg", ".jpeg", ".png")):
        pil_img = Image.open(io.BytesIO(content)).convert("RGB")
        prob = predict_vit(pil_img)
        label = "FAKE" if prob >= 0.5 else "REAL"

        # confidence= round(prob * 100, 2),
        # response = {
        #     "label": label,
        #     "confidence": confidence,
        #     "probability": 1-({confidence}*100),
        #     "suspicious_frames": [],
        #     "file_type": "image",
        #     "filename": file.filename
        # }

        # Agar prediction "REAL/Authentic" hai
        if label == "REAL" or label == "Authentic":
            authentic_prob = round(prob * 100, 2)
            probability = round((1 - prob) * 100, 2)
        else:  # Agar "FAKE" hai
            probability = round(prob * 100, 2)
            authentic_prob = round((1 - prob) * 100, 2)

        response = {
            "label": label,
            "confidence": round(prob * 100, 2),
            "authentic_probability": authentic_prob,  
            "probability": probability,           
            "suspicious_frames": [],
            "file_type": "image",
            "filename": file.filename
        }

        
        # Print JSON to terminal
        print("\n" + "="*50, flush=True)
        print("IMAGE ANALYSIS RESULT:", flush=True)
        print(json.dumps(response, indent=2), flush=True)
        print("="*50 + "\n", flush=True)
        
        return response

    # ---------------- VIDEO ----------------
    elif filename.endswith((".mp4", ".mov", ".avi", ".mkv")):
        temp_path = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        temp_path.write(content)
        temp_path.close()

        try:
            frames = iio.imiter(temp_path.name)

            frame_probs = []
            suspicious_frames = []
            frame_details = []

            for idx, frame in enumerate(frames):
                if idx > 30:  # limit for hackathon speed
                    break

                pil_img = Image.fromarray(frame.astype("uint8"))
                prob = predict_vit(pil_img)

                frame_probs.append(prob * 100)
                
                # Store frame details for logging
                frame_details.append({
                    "frame_number": idx,
                    "confidence": round(prob * 100, 2)
                })

                if prob >= 0.7:
                    suspicious_frames.append(frame_to_base64(frame))

            if not frame_probs:
                raise HTTPException(status_code=400, detail="No valid video frames.")

            avg_conf = float(np.mean(frame_probs))
            label = "FAKE" if avg_conf >= 50 else "REAL"

            response = {
                "label": label,
                "confidence": round(avg_conf, 2),
                "suspicious_frames": suspicious_frames,
                "file_type": "video",
                "filename": file.filename,
                "total_frames_analyzed": len(frame_probs),
                "suspicious_frame_count": len(suspicious_frames)
            }
            
            # Print JSON to terminal (without base64 images for readability)
            response_for_print = response.copy()
            response_for_print["suspicious_frames"] = f"[{len(suspicious_frames)} base64 images]"
            
            print("\n" + "="*50, flush=True)
            print("VIDEO ANALYSIS RESULT:", flush=True)
            print(json.dumps(response_for_print, indent=2), flush=True)
            print("\nFrame-by-frame details:", flush=True)
            print(json.dumps(frame_details, indent=2), flush=True)
            print("="*50 + "\n", flush=True)
            
            return response

        finally:
            try:
                os.unlink(temp_path.name)
            except:
                pass

    else:
        raise HTTPException(status_code=400, detail="Unsupported file")
