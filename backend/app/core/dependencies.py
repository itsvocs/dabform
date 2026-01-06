"""
FastAPI Dependencies für Authentication
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_token
from app.models.benutzer import Benutzer

# Bearer Token Scheme
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Benutzer:
    """Aktuellen User aus JWT Token holen"""

    # Token aus Authorization Header
    token = credentials.credentials

    # Token verifizieren
    payload = verify_token(token)

    # User ID aus Payload (jetzt String → Int)
    user_id_str: str = payload.get("sub")
    user_id = int(user_id_str)  # String zu Int

    # User aus DB holen
    user = db.query(Benutzer).filter(Benutzer.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # Check ob aktiv
    if not user.aktiv:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    return user
def get_current_admin_user(
    current_user: Benutzer = Depends(get_current_user)
) -> Benutzer:
    """
    Nur für Admin-Rolle
    """
    if current_user.rolle != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user
