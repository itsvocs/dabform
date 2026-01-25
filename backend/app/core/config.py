"""
Application Configuration
"""

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application Settings """

    # Database
    DATABASE_URL: str = "postgresql://dab_user:dab_password@localhost:5432/dab_form"

    # JWT
    SECRET_KEY: str = "change-this-in-production-min-32-characters-long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # App
    APP_NAME: str = "DAB-Form API"
    DEBUG: bool = True
    VERSION: str = "1.0.0"

    # Pydantic v2 Config
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

# Singleton
settings = Settings()