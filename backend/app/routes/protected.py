from fastapi import APIRouter, Depends
from backend.app.auth import get_current_user

router = APIRouter(prefix="/protected", tags=["Protected"])

@router.get("/me")
def read_user_data(current_user: dict = Depends(get_current_user)):
    return {"message": "Access granted!", "user": current_user}