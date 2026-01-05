"""
Security & JWT Token Handling
"""

from datetime import datetime, timedelta
from typing import Optional
import traceback
from jose import JWTError, jwt
from fastapi import HTTPException, status

from app.core.config import settings

# JWT Settings
ALGORITHM = settings.ALGORITHM
SECRET_KEY = settings.SECRET_KEY
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    JWT Access Token erstellen
    
    Args:
        data: Payload Data (user_id, email, rolle)
        expires_delta: Ablaufzeit (Optional)
    
    Returns:
        JWT Token String
    """
    to_encode = data.copy()

    # Ablaufzeit berechnen
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # Expire in Payload
    to_encode.update({"exp": expire})

    # Token erstellen
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """
    JWT Token verifizieren und Payload zurückgeben
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # DEBUG
        print("DEBUG verify_token:")
        print(f"Token (first 50 chars): {token[:50]}")
        print(f"SECRET_KEY (first 20 chars): {SECRET_KEY[:20]}")
        print(f"ALGORITHM: {ALGORITHM}")

        # Token dekodieren
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        print("Token decoded successfully!")
        print(f"Payload: {payload}")

        # User ID aus Payload holen
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise credentials_exception

        try:
            user_id = int(user_id_str)
        except (ValueError, TypeError):
            print(f"Cannot convert sub to int: {user_id_str}")
            raise credentials_exception from ValueError

        print(f"User ID: {user_id}")

        return payload

    except JWTError as e:
        print(f"❌ JWTError: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        raise credentials_exception from e
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        raise credentials_exception from e
