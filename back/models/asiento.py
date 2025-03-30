from config.database import db

class Asiento(db.Model):
    __tablename__ = 'asientos'
    
    id = db.Column(db.Integer, primary_key=True)
    sala_id = db.Column(db.Integer, db.ForeignKey('salas.id'), nullable=False)
    fila = db.Column(db.String(2))
    numero = db.Column(db.Integer)
    tipo = db.Column(db.String(20))
    estado = db.Column(db.String(20))
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    sala = db.relationship('Sala', back_populates='asientos')
    detalles_reserva = db.relationship('DetalleReserva', back_populates='asiento', cascade='all, delete-orphan', lazy=True)