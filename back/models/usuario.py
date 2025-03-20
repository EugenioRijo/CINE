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
from werkzeug.security import generate_password_hash, check_password_hash

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
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(self, nombre, email, password):
        self.nombre = nombre
        self.email = email
        self.set_password(password)
    
    def set_password(self, password):
        """Establece la contraseña del usuario"""
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        """Verifica la contraseña del usuario"""
        return check_password_hash(self.password, password)
    
    def to_dict(self):
        """Convierte el usuario a diccionario"""
        return {
            'id': self.id,
            'nombre': self.nombre,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Usuario {self.email}>' 