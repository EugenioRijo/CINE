from flask import Flask, render_template
#https://github.com/EugenioRijo/CINE.git
app=Flask(__name__)

@app.route('/')
def bienvenida():
    return render_template('bienvenida.html')

@app.route('/cartelera')
def movies():
    # Aquí puedes definir una lista de películas
    movie_list = [
        {'title': 'Pelicula 1', 'duration': '120 min', 'year': 2021},
        {'title': 'Pelicula 2', 'duration': '90 min', 'year': 2020},
        {'title': 'Pelicula 3', 'duration': '150 min', 'year': 2019},
    ]
    return render_template('cartelera.html', movies=movie_list)

if __name__ == '__main__':
    app.run(debug=True)