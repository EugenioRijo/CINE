from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'cesar'  # Necesario para usar sesiones

# Datos de prueba para películas y horarios
peliculas = [
    {'id': 1, 'titulo': 'Pelicula 1', 'sinopsis': 'Sinopsis de Pelicula 1'},
    {'id': 2, 'titulo': 'Pelicula 2', 'sinopsis': 'Sinopsis de Pelicula 2'},
]

horarios = {
    1: [{'id': 1, 'hora': '17:00', 'sala': '1'}, {'id': 2, 'hora': '20:00', 'sala': '2'}],
    2: [{'id': 3, 'hora': '18:00', 'sala': '1'}, {'id': 4, 'hora': '21:00', 'sala': '2'}],
}

@app.template_filter('enumerate')
def enumerate_filter(sequence):
    return list(enumerate(sequence))

@app.route('/comprar/<int:pelicula_id>', methods=['GET', 'POST'])
def comprar(pelicula_id):
    pelicula = next((p for p in peliculas if p['id'] == pelicula_id), None)
    
    if request.method == 'POST':
        cantidad = request.form.get('cantidad')
        horario_id = request.form.get('horario_id')
        
        # Guardar la selección en el contexto de la sesión
        session['cantidad'] = cantidad
        session['horario_id'] = horario_id
        
        # Redirigir a la pantalla de selección de asientos
        return redirect(url_for('seleccionar_asientos', horario_id=horario_id, cantidad=cantidad))

    return render_template('comprar.html', pelicula=pelicula, horarios=horarios[pelicula_id])

@app.route('/seleccionar_asientos', methods=['GET', 'POST'])
def seleccionar_asientos():
    horario_id = request.args.get('horario_id')
    cantidad = request.args.get('cantidad')

    # Generar asientos de A1 a F10
    asientos_disponibles = [f"{chr(fila)}{num}" for fila in range(ord('A'), ord('F') + 1) for num in range(1, 11)]
    
    # Variable para almacenar los asientos reservados
    if 'asientos_reservados' not in session:
        session['asientos_reservados'] = []  # Inicializa la lista en la sesión si no existe

    if request.method == 'POST':
        seleccionados = request.form.getlist('asiento')  # Obtener asientos seleccionados
        
        # Guardar los asientos seleccionados en la sesión
        session['asientos_reservados'] = seleccionados
        
        # Redirigir a una página de confirmación o muestra la selección
        return redirect(url_for('confirmacion'))  # Redirige a una nueva página de confirmación

    return render_template('seleccionar_asientos.html', asientos=asientos_disponibles, cantidad=cantidad)

@app.route('/confirmacion')
def confirmacion():
    asientos_reservados = session.get('asientos_reservados', [])
    return render_template('confirmacion.html', asientos=asientos_reservados)

@app.route('/')
def index():
    return render_template('bienvenida.html')

@app.route('/cartelera')
def cartelera():
    return render_template('cartelera.html', peliculas=peliculas)

@app.route('/pelicula/<int:pelicula_id>')
def pelicula(pelicula_id):
    pelicula = next((p for p in peliculas if p['id'] == pelicula_id), None)  # Busca la película por ID.    
    return render_template('detallespeliculas.html', pelicula=pelicula, horarios=horarios)

if __name__ == '__main__':
    app.run(debug=True)

