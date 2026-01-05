"""
Authentication Schemas
"""

from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    """Login Request Body"""
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    """Token Response"""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Data gespeichert im Token"""
    user_id: int
    email: str
    rolle: str
