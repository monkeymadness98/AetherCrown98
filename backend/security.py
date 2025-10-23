"""
Security Module for AetherCrown98
Implements JWT authentication, CSRF protection, encryption, and RBAC
"""
import os
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, List
import jwt
from cryptography.fernet import Fernet
from functools import wraps
from fastapi import HTTPException, Header, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import hashlib

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
FERNET_KEY = os.getenv("FERNET_KEY", Fernet.generate_key().decode())

# Initialize Fernet encryption
cipher_suite = Fernet(FERNET_KEY.encode() if isinstance(FERNET_KEY, str) else FERNET_KEY)

# Security scheme
security = HTTPBearer()

class JWTAuth:
    """JWT Authentication Handler"""
    
    @staticmethod
    def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
        """
        Create JWT access token
        
        Args:
            data: Payload data to encode
            expires_delta: Token expiration time
            
        Returns:
            Encoded JWT token
        """
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Dict:
        """
        Verify and decode JWT token
        
        Args:
            token: JWT token to verify
            
        Returns:
            Decoded token payload
            
        Raises:
            HTTPException: If token is invalid or expired
        """
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
    
    @staticmethod
    def get_current_user(credentials: HTTPAuthorizationCredentials) -> Dict:
        """
        Extract current user from JWT token
        
        Args:
            credentials: HTTP Authorization credentials
            
        Returns:
            User data from token
        """
        token = credentials.credentials
        return JWTAuth.verify_token(token)

class FieldEncryption:
    """Encrypt sensitive fields using Fernet"""
    
    @staticmethod
    def encrypt(data: str) -> str:
        """
        Encrypt sensitive data
        
        Args:
            data: Plain text data
            
        Returns:
            Encrypted data as string
        """
        encrypted = cipher_suite.encrypt(data.encode())
        return encrypted.decode()
    
    @staticmethod
    def decrypt(encrypted_data: str) -> str:
        """
        Decrypt encrypted data
        
        Args:
            encrypted_data: Encrypted data string
            
        Returns:
            Decrypted plain text
        """
        decrypted = cipher_suite.decrypt(encrypted_data.encode())
        return decrypted.decode()

class CSRFProtection:
    """CSRF Token Protection"""
    
    @staticmethod
    def generate_csrf_token() -> str:
        """Generate CSRF token"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def verify_csrf_token(token: str, stored_token: str) -> bool:
        """
        Verify CSRF token
        
        Args:
            token: Token from request
            stored_token: Token stored in session
            
        Returns:
            True if tokens match
        """
        return secrets.compare_digest(token, stored_token)

class RBACManager:
    """Role-Based Access Control Manager"""
    
    # Define permissions for each role
    ROLE_PERMISSIONS = {
        "admin": ["read", "write", "delete", "manage_users", "manage_org"],
        "manager": ["read", "write", "delete"],
        "user": ["read", "write"],
        "viewer": ["read"]
    }
    
    @staticmethod
    def has_permission(role: str, permission: str) -> bool:
        """
        Check if role has specific permission
        
        Args:
            role: User role
            permission: Required permission
            
        Returns:
            True if role has permission
        """
        return permission in RBACManager.ROLE_PERMISSIONS.get(role, [])
    
    @staticmethod
    def require_permission(permission: str):
        """
        Decorator to require specific permission
        
        Args:
            permission: Required permission
        """
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                # Extract user from request
                request = kwargs.get('request')
                if not request:
                    raise HTTPException(status_code=401, detail="Authentication required")
                
                # Get user role (from JWT or session)
                user_role = getattr(request.state, 'user_role', 'viewer')
                
                if not RBACManager.has_permission(user_role, permission):
                    raise HTTPException(
                        status_code=403, 
                        detail=f"Permission denied: {permission} required"
                    )
                
                return await func(*args, **kwargs)
            return wrapper
        return decorator

class SecurityHeaders:
    """Security headers middleware"""
    
    @staticmethod
    def add_security_headers(response):
        """Add security headers to response"""
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        return response

class APIKeyAuth:
    """API Key Authentication for organization-level access"""
    
    @staticmethod
    def hash_api_key(api_key: str) -> str:
        """Hash API key for storage"""
        return hashlib.sha256(api_key.encode()).hexdigest()
    
    @staticmethod
    def generate_api_key() -> str:
        """Generate new API key"""
        return f"ak_{secrets.token_urlsafe(32)}"
    
    @staticmethod
    async def verify_api_key(api_key: str, organization_id: str) -> bool:
        """
        Verify API key for organization
        
        Args:
            api_key: API key to verify
            organization_id: Organization ID
            
        Returns:
            True if API key is valid
        """
        # In production, check against database
        # For now, return basic validation
        return api_key.startswith("ak_") and len(api_key) > 20

# Middleware for automatic security headers
async def security_middleware(request: Request, call_next):
    """Add security headers to all responses"""
    response = await call_next(request)
    return SecurityHeaders.add_security_headers(response)

# Password hashing utilities
def hash_password(password: str) -> str:
    """Hash password using bcrypt (placeholder - use bcrypt in production)"""
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed_password
