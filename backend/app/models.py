import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from .db import Base


class RoleEnum(str, enum.Enum):
    student = "Student"
    admin = "Admin"


class TicketStatus(str, enum.Enum):
    pending = "Pending"
    verified = "Verified"
    resolved = "Resolved"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.student)
    total_points = Column(Integer, nullable=False, default=0)

    tickets = relationship("Ticket", back_populates="user")


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    qr_code_string = Column(String(120), unique=True, nullable=False)
    type = Column(String(100), nullable=False)
    location_zone = Column(String(120), nullable=False)

    tickets = relationship("Ticket", back_populates="asset")


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    description = Column(Text, nullable=False)
    image_url = Column(String(255), nullable=True)
    ai_category_assigned = Column(String(100), nullable=False)
    status = Column(Enum(TicketStatus), nullable=False, default=TicketStatus.pending)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    user = relationship("User", back_populates="tickets")
    asset = relationship("Asset", back_populates="tickets")


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    zone_name = Column(String(120), unique=True, nullable=False)
    svg_path_id = Column(String(120), unique=True, nullable=False)
