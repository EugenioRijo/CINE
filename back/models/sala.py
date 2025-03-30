from config.database import db

class Sala(db.Model):
    __tablename__ = 'salas'
    
    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.String(10), nullable=False)
    capacidad = db.Column(db.Integer, nullable=False)
    tipo = db.Column(db.String(20))
    estado = db.Column(db.String(20))
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    asientos = db.relationship('Asiento', back_populates='sala', cascade='all, delete-orphan', lazy=True)
    funciones = db.relationship('Funcion', back_populates='sala', cascade='all, delete-orphan', lazy=True)