"""
Application Configuration
"""

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application Settings """

    # Database
    # DATABASE_URL: str = "postgresql://dab_user:dab_password@localhost:5432/dab_form"
    DATABASE_URL: str 
    # = "postgresql://neondb_owner:npg_vseFVyHN76ap@ep-winter-morning-ag1eib8c-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
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