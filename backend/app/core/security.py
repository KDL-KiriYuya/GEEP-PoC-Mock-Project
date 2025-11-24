from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt  # type: ignore
from passlib.context import CryptContext  # type: ignore

# JWT settings
SECRET_KEY = "your-secret-key-change-this-in-production"  # TODO: Move to environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    # Truncate password to 72 bytes for bcrypt compatibility
    if len(plain_password.encode("utf-8")) > 72:
        plain_password = plain_password.encode("utf-8")[:72].decode("utf-8", errors="ignore")

    try:
        return pwd_context.verify(plain_password, hashed_password)
    except ValueError as e:
        # Handle bcrypt 72-byte limit error
        if "72 bytes" in str(e):
            # Truncate and retry
            plain_password = plain_password[:72]
            return pwd_context.verify(plain_password, hashed_password)
        raise


def get_password_hash(password: str) -> str:
    """Hash a password."""
    # Truncate password to 72 bytes for bcrypt compatibility
    if len(password.encode("utf-8")) > 72:
        password = password.encode("utf-8")[:72].decode("utf-8", errors="ignore")

    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[str]:
    """Decode a JWT access token and return the username."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except JWTError:
        return None
