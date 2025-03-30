from config.database import db

class Pelicula(db.Model):
    __tablename__ = 'peliculas'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(200), nullable=False)
    sinopsis = db.Column(db.Text)
    duracion = db.Column(db.Integer)
    clasificacion = db.Column(db.String(10))
    genero = db.Column(db.String(50))
    director = db.Column(db.String(100))
    fecha_estreno = db.Column(db.Date)
    poster_url = db.Column(db.String(255))
    estado = db.Column(db.String(20))
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    funciones = db.relationship('Funcion', back_populates='pelicula', cascade='all, delete-orphan', lazy=True)