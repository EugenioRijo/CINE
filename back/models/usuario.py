"""
Modelo de Usuario
Define la estructura y comportamiento de la entidad Usuario en la base de datos.

Áreas de mejora potenciales:
- Agregar validaciones personalizadas
- Implementar métodos de serialización/deserialización
- Agregar relaciones con otros modelos (ej: roles, perfiles)
- Implementar soft delete
- Agregar campos de metadatos adicionales
- Implementar eventos del modelo (before_save, after_save, etc.)
"""

from config.database import db
from datetime import datetime

class Usuario(db.Model):
    """
    Modelo que representa un usuario en el sistema.
    
    Attributes:
        id (int): Identificador único del usuario
        nombre (str): Nombre completo del usuario
        email (str): Email único del usuario
        password (str): Contraseña hasheada del usuario
        created_at (datetime): Fecha de creación del registro
        updated_at (datetime): Fecha de última actualización
    """
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Usuario {self.email}>' 