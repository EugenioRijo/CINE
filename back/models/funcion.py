from config.database import db

class Funcion(db.Model):
    __tablename__ = 'funciones'
    
    id = db.Column(db.Integer, primary_key=True)
    pelicula_id = db.Column(db.Integer, db.ForeignKey('peliculas.id'), nullable=False)
    sala_id = db.Column(db.Integer, db.ForeignKey('salas.id'), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    hora_inicio = db.Column(db.Time, nullable=False)
    precio_general = db.Column(db.Numeric(10, 2))
    precio_reducido = db.Column(db.Numeric(10, 2))
    estado = db.Column(db.String(20))
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    pelicula = db.relationship('Pelicula', back_populates='funciones')
    sala = db.relationship('Sala', back_populates='funciones')
    reservas = db.relationship('Reserva', back_populates='funcion', cascade='all, delete-orphan', lazy=True)