from config.database import db
from datetime import datetime

class Snack(db.Model):
    __tablename__ = 'snacks'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False, unique=True)
    descripcion = db.Column(db.Text)
    precio = db.Column(db.Numeric(10,2), nullable=False)
    categoria = db.Column(db.String(50))
    stock = db.Column(db.Integer, default=0)
    imagen_url = db.Column(db.String(255))
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    def __repr__(self):
        return f'<Snack {self.nombre}>'