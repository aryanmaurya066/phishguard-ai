from fastapi import APIRouter, HTTPException
import subprocess

router = APIRouter()

@router.post("/admin/retrain")
async def retrain_model():
    try:
        result = subprocess.run(
            ["python", "train_incremental.py"],
            capture_output=True,
            text=True,
            check=True
        )
        return {
            "status": "success",
            "message": "Model retrained successfully",
            "output": result.stdout
        }
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {e.stderr}")
