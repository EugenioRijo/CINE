from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Cliente, Reserva, DetalleReserva, VentaSnack, Funcion, Pelicula, Sala, Snack
from sqlalchemy import func, and_, desc
from config.database import db
from datetime import datetime, timedelta

estadisticas_bp = Blueprint('estadisticas', __name__)

@estadisticas_bp.route('/api/estadisticas')
@jwt_required()
def obtener_estadisticas():
    # Verificar que el usuario es admin
    current_user_id = get_jwt_identity()
    usuario = Cliente.query.get(current_user_id)
    if not usuario or usuario.es_miembro != 1:
        return jsonify({"error": "No autorizado"}), 403

    try:
        # Obtener la fecha de hace 24 horas
        fecha_24h = datetime.now() - timedelta(days=1)
        
        # Estadísticas generales
        total_peliculas = Pelicula.query.filter_by(estado='activa').count()
        total_salas = Sala.query.filter_by(estado='activa').count()
        total_miembros = Cliente.query.filter_by(es_miembro=1).count()
        
        # Entradas vendidas en las últimas 24 horas
        entradas_24h = db.session.query(func.count(DetalleReserva.id)).join(
            Reserva, DetalleReserva.reserva_id == Reserva.id
        ).filter(Reserva.fecha_creacion >= fecha_24h).scalar() or 0
        
        # Ventas de combos en las últimas 24 horas
        ventas_combos_24h = VentaSnack.query.filter(
            VentaSnack.fecha_venta >= fecha_24h
        ).count()
        
        # Ingresos totales en las últimas 24 horas (entradas + combos)
        ingresos_entradas = db.session.query(
            func.sum(Funcion.precio)
        ).join(
            Reserva, Funcion.id == Reserva.funcion_id
        ).join(
            DetalleReserva, Reserva.id == DetalleReserva.reserva_id
        ).filter(
            Reserva.fecha_creacion >= fecha_24h
        ).scalar() or 0
        
        ingresos_combos = db.session.query(
            func.sum(Snack.precio)
        ).join(
            VentaSnack, Snack.id == VentaSnack.snack_id
        ).filter(
            VentaSnack.fecha_venta >= fecha_24h
        ).scalar() or 0
        
        ingresos_totales = ingresos_entradas + ingresos_combos
        
        # Calcular ocupación total
        total_asientos = db.session.query(func.sum(Sala.capacidad)).scalar() or 0
        asientos_ocupados = DetalleReserva.query.join(
            Reserva, DetalleReserva.reserva_id == Reserva.id
        ).join(
            Funcion, Reserva.funcion_id == Funcion.id
        ).filter(
            Funcion.hora_inicio >= fecha_24h
        ).count()
        
        ocupacion_total = (asientos_ocupados / total_asientos * 100) if total_asientos > 0 else 0

        # Miembros más activos (basado en reservas y compras)
        miembros_query = db.session.query(
            Cliente.nombre,
            Cliente.email,
            Cliente.fecha_registro,
            func.count(Reserva.id).label('total_reservas'),
            func.count(VentaSnack.id).label('total_compras')
        ).outerjoin(
            Reserva, Cliente.id == Reserva.cliente_id
        ).outerjoin(
            VentaSnack, Cliente.id == VentaSnack.cliente_id
        ).filter(
            Cliente.es_miembro == 1
        ).group_by(
            Cliente.id, Cliente.nombre, Cliente.email, Cliente.fecha_registro
        ).order_by(
            desc('total_reservas')
        ).limit(5)

        miembros = []
        for m in miembros_query:
            miembros.append({
                "nombre": m.nombre,
                "email": m.email,
                "fecha_registro": m.fecha_registro.strftime("%Y-%m-%d"),
                "total_reservas": m.total_reservas,
                "total_compras": m.total_compras,
                "nivel_actividad": calcular_nivel_actividad(m.total_reservas, m.total_compras)
            })

        # Películas más vistas
        peliculas_query = db.session.query(
            Pelicula.titulo,
            Funcion.sala_id,
            Funcion.hora_inicio,
            func.count(DetalleReserva.id).label('total_vistas'),
            func.sum(Funcion.precio).label('ingresos')
        ).join(
            Funcion, Pelicula.id == Funcion.pelicula_id
        ).join(
            Reserva, Funcion.id == Reserva.funcion_id
        ).join(
            DetalleReserva, Reserva.id == DetalleReserva.reserva_id
        ).filter(
            Funcion.hora_inicio >= fecha_24h
        ).group_by(
            Pelicula.titulo, Funcion.sala_id, Funcion.hora_inicio
        ).order_by(
            desc('total_vistas')
        ).limit(3)

        peliculas = []
        max_vistas = 0
        for p in peliculas_query:
            if max_vistas == 0:
                max_vistas = p.total_vistas
            progreso = (p.total_vistas / max_vistas * 100) if max_vistas > 0 else 0
            sala = Sala.query.get(p.sala_id)
            peliculas.append({
                "titulo": p.titulo,
                "vistas": p.total_vistas,
                "sala": f"Sala {sala.numero}",
                "horario": p.hora_inicio.strftime("%H:%M"),
                "ingresos": float(p.ingresos),
                "progreso": progreso
            })

        # Combos más vendidos
        combos_query = db.session.query(
            Snack.nombre,
            func.count(VentaSnack.id).label('total_vendidos'),
            func.sum(Snack.precio).label('ingresos')
        ).join(
            VentaSnack, Snack.id == VentaSnack.snack_id
        ).filter(
            VentaSnack.fecha_venta >= fecha_24h
        ).group_by(
            Snack.nombre
        ).order_by(
            desc('total_vendidos')
        ).limit(3)

        combos = []
        max_vendidos = 0
        for c in combos_query:
            if max_vendidos == 0:
                max_vendidos = c.total_vendidos
            progreso = (c.total_vendidos / max_vendidos * 100) if max_vendidos > 0 else 0
            combos.append({
                "nombre": c.nombre,
                "cantidad": c.total_vendidos,
                "ingresos": float(c.ingresos),
                "progreso": progreso
            })

        # Salas más demandadas con distribución por horarios
        salas_query = db.session.query(
            Sala.numero,
            Sala.capacidad,
            Sala.tipo,
            func.date_part('hour', Funcion.hora_inicio).label('hora'),
            func.count(DetalleReserva.id).label('asientos_ocupados')
        ).join(
            Funcion, Sala.id == Funcion.sala_id
        ).join(
            Reserva, Funcion.id == Reserva.funcion_id
        ).join(
            DetalleReserva, Reserva.id == DetalleReserva.reserva_id
        ).filter(
            Funcion.hora_inicio >= fecha_24h
        ).group_by(
            Sala.numero, Sala.capacidad, Sala.tipo, 'hora'
        ).order_by(
            Sala.numero, 'hora'
        )

        salas = {}
        for s in salas_query:
            if s.numero not in salas:
                salas[s.numero] = {
                    "sala": f"Sala {s.numero}",
                    "tipo": s.tipo,
                    "capacidad_total": s.capacidad,
                    "distribucion_horaria": [],
                    "total_ocupacion": 0
                }
            
            ocupacion = (s.asientos_ocupados / s.capacidad * 100) if s.capacidad > 0 else 0
            salas[s.numero]["distribucion_horaria"].append({
                "hora": int(s.hora),
                "ocupacion": ocupacion,
                "asientos_ocupados": s.asientos_ocupados
            })
            salas[s.numero]["total_ocupacion"] += ocupacion

        # Convertir el diccionario de salas a lista y ordenar por ocupación total
        salas_list = list(salas.values())
        salas_list.sort(key=lambda x: x["total_ocupacion"], reverse=True)
        salas_list = salas_list[:3]

        return jsonify({
            "stats_generales": {
                "total_peliculas": total_peliculas,
                "total_ventas_combos": ventas_combos_24h,
                "total_salas": total_salas,
                "total_miembros": total_miembros,
                "ocupacion_total": round(ocupacion_total, 1),
                "ingresos_totales": float(ingresos_totales),
                "entradas_vendidas": entradas_24h
            },
            "miembros_activos": miembros,
            "peliculas_mas_vistas": peliculas,
            "combos_mas_vendidos": combos,
            "salas_mas_demandadas": salas_list
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def calcular_nivel_actividad(total_reservas, total_compras):
    score = total_reservas * 0.6 + total_compras * 0.4  # Ponderación: 60% reservas, 40% compras
    if score >= 10:
        return {"nivel": "Alto", "color": "#2e7d32"}  # Verde
    elif score >= 5:
        return {"nivel": "Medio", "color": "#ed6c02"}  # Naranja
    else:
        return {"nivel": "Bajo", "color": "#d32f2f"}  # Rojo 