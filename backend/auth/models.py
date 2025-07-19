from pydantic import BaseModel

class UserRegister(BaseModel):
    name: str
    username: str
    password: str
    contact_no: str | None = None
    gmail: str | None = None

class UserLogin(BaseModel):
    username: str
    password: str
