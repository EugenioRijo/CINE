from config.database import db
from datetime import datetime
from werkzeug.security import check_password_hash


class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  
    telefono = db.Column(db.String(20), nullable=True)
    fecha_registro = db.Column(db.DateTime, server_default=db.func.now())
    es_miembro = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    reservas = db.relationship('Reserva', back_populates='cliente', cascade='all, delete-orphan', lazy=True)

    def __repr__(self):
        return f'<Cliente {self.email}>'
    
    def verificar_password(self, password: str) -> bool:
        return check_password_hash(self.password, password)  # ✅ Orden correcto