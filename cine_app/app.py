from flask import Flask, render_template

app = Flask(__name__)

# Datos de ejemplo de la cartelera con detalles adicionales
peliculas = [
    {
        "titulo": "El Padrino",
        "anio": 1972,
        "descripcion": "La historia de una familia de la mafia en Estados Unidos.",
        "hora": "17:00",
        "sala": "1"
    },
    {
        "titulo": "Inception",
        "anio": 2010,
        "descripcion": "Un ladrón que roba secretos a través de los sueños.",
        "hora": "20:00",
        "sala": "2"
    },
    {
        "titulo": "Avatar",
        "anio": 2009,
        "descripcion": "Un exmarine que se encuentra en el mundo alienígena de Pandora.",
        "hora": "18:00",
        "sala": "3"
    },
    {
        "titulo": "Titanic",
        "anio": 1997,
        "descripcion": "Una historia de amor en el trasatlántico RMS Titanic.",
        "hora": "19:30",
        "sala": "1"
    }
]

@app.template_filter('enumerate')
def enumerate_filter(sequence):
    return list(enumerate(sequence))

@app.route('/')
def index():
    return render_template('bienvenida.html')

@app.route('/cartelera')
def cartelera():
    return render_template('cartelera.html', peliculas=peliculas)

@app.route('/pelicula/<int:pelicula_id>')
def pelicula(pelicula_id):
    pelicula = peliculas[pelicula_id]  # Obtiene la película por su índice
    return render_template('detallespeliculas.html', pelicula=pelicula)

if __name__ == '__main__':
    app.run(debug=True)
