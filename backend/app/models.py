from datetime import datetime
from typing import List, Optional, Union, Any
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId

# Custom class for Pydantic to validate mongodb ObjectId's in schemas
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Any

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        # This replaces __modify_schema__
        json_schema = handler(core_schema)
        json_schema.update(type="string")
        return json_schema


# User schema in mongodb
class User(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str
    email: EmailStr
    password_hash: str
    role: str = Field(default="developer", description="developer | admin")
    status: str = Field(default="active", description="active | inactive | suspended | deleted")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


