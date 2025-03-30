from database import db
from datetime import datetime

class Membership(db.Model):
    __tablename__ = 'membresias'
    
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('clientes.id'), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)  # 'monthly' o 'annual'
    fecha_inicio = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    fecha_expiracion = db.Column(db.DateTime, nullable=False)
    esta_activa = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, cliente_id, tipo, fecha_expiracion):
        self.cliente_id = cliente_id
        self.tipo = tipo
        self.fecha_expiracion = fecha_expiracion

    def to_dict(self):
        return {
            'id': self.id,
            'cliente_id': self.cliente_id,
            'tipo': self.tipo,
            'fecha_inicio': self.fecha_inicio.isoformat() if self.fecha_inicio else None,
            'fecha_expiracion': self.fecha_expiracion.isoformat() if self.fecha_expiracion else None,
            'esta_activa': self.esta_activa,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        } 