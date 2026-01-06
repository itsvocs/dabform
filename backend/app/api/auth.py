"""
Authentication API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.benutzer import BenutzerResponse
from app.services.benutzer import get_benutzer_by_email, verify_password, hash_password
from app.models.benutzer import Benutzer

# Router
router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/login", response_model=TokenResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Login Endpoint
    
    - **email**: User Email
    - **password**: User Passwort
    
    Returns:
        JWT Access Token
    """
    # User holen
    user = get_benutzer_by_email(db, login_data.email)

    # Check ob User existiert
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Check ob aktiv
    if not user.aktiv:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    # Passwort verifizieren
    if not verify_password(login_data.password, user.passwort_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )


    # JWT Token erstellen
    access_token = create_access_token(
        data={
           "sub": str(user.id),
            "email": user.email,
            "rolle": user.rolle
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=BenutzerResponse)
def get_current_user_info(
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Aktuell eingeloggten User holen
    
    Benötigt Authorization Header mit JWT Token
    """
    return current_user

@router.put("/change-password")
def change_password(
    old_password: str,
    new_password: str, 
    db: Session = Depends(get_db),
    current_user: Benutzer = Depends(get_current_user)
):
    """
    Passwort ändern
    """
    # Passwort verifizieren
    if not verify_password(old_password, current_user.passwort_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Altes Password ist falsch"
        )
    
    if len(new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Das neue Password muss mindestens 8 Zeichen lang sein"
        )

    current_user.passwort_hash = hash_password(new_password)
    db.commit()

    return {
        "message": "Passwort erfolgreich geändert"
    }
