import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Autonomous AI Report Generation Agent SaaS"
    API_V1_STR: str = "/api/v1"
    
    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_key_change_me_in_production_1234567890")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./report_agent.db")
    
    # AI API Keys (Optional, fallback to mock is implemented)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "mock")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    
    # LangSmith Tracing Parameters
    LANGCHAIN_TRACING_V2: str = os.getenv("LANGCHAIN_TRACING_V2", "false")
    LANGCHAIN_ENDPOINT: str = os.getenv("LANGCHAIN_ENDPOINT", "https://api.smith.langchain.com")
    LANGCHAIN_API_KEY: str = os.getenv("LANGCHAIN_API_KEY", "")
    LANGCHAIN_PROJECT: str = os.getenv("LANGCHAIN_PROJECT", "autonomous-report-agent")
    
    # Initial Admin Config
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@reportagent.ai")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "AdminPassword123!")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
