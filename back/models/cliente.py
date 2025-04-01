from config.database import db
from datetime import datetime, date
from werkzeug.security import check_password_hash

class Cliente(db.Model):
    __tablename__ = 'clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    cedula = db.Column(db.String(15), unique=True, nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)  # Campo existente
    password = db.Column(db.String(200), nullable=False)
    telefono = db.Column(db.String(20), nullable=True)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    fecha_registro = db.Column(db.DateTime, server_default=db.func.now())
    es_miembro = db.Column(db.Integer, default=0)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    facturas = db.relationship('Factura', back_populates='cliente')

    def __repr__(self):
        return f'<Cliente {self.cedula} - {self.nombre}>'
    
    def verificar_password(self, password: str) -> bool:
        return check_password_hash(self.password, password)
    
    @property
    def edad(self) -> int:
        hoy = date.today()
        return hoy.year - self.fecha_nacimiento.year - (
            (hoy.month, hoy.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
        )