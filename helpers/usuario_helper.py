"""
Helper de Usuario
Implementa la lógica de negocio relacionada con los usuarios.

Áreas de mejora potenciales:
- Implementar validaciones más robustas
- Agregar manejo de roles y permisos
- Implementar sistema de notificaciones
- Agregar funcionalidades de recuperación de contraseña
- Implementar verificación de email
- Agregar autenticación con proveedores externos (OAuth)
- Implementar sistema de tokens JWT
"""

from repositories.usuario_repository import UsuarioRepository
from werkzeug.security import generate_password_hash
from models.usuario import Usuario
from config.database import db

class UsuarioHelper:
    """
    Helper que maneja la lógica de negocio relacionada con usuarios.
    Actúa como una capa intermedia entre las rutas y el repositorio.
    """
    
    @staticmethod
    def registrar_usuario(nombre, email, password):
        """
        Registra un nuevo usuario en el sistema
        
        Args:
            nombre (str): Nombre del usuario
            email (str): Email del usuario
            password (str): Contraseña del usuario
            
        Returns:
            tuple: (Usuario, str) - Usuario creado y mensaje de error (si existe)
        """
        try:
            # Verificar si el usuario ya existe
            usuario_existente = Usuario.query.filter_by(email=email).first()
            if usuario_existente:
                return None, "El email ya está registrado"
            
            # Crear nuevo usuario
            nuevo_usuario = Usuario(
                nombre=nombre,
                email=email,
                password=password
            )
            
            # Guardar en la base de datos
            db.session.add(nuevo_usuario)
            db.session.commit()
            
            return nuevo_usuario, None
            
        except Exception as e:
            db.session.rollback()
            return None, str(e)
    
    @staticmethod
    def actualizar_usuario(usuario_id, data):
        """
        Actualiza los datos de un usuario existente
        
        Args:
            usuario_id (int): ID del usuario a actualizar
            data (dict): Diccionario con los campos a actualizar
            
        Returns:
            tuple: (Usuario, error_message)
            - Si la actualización es exitosa: (usuario, None)
            - Si hay error: (None, mensaje_error)
        """
        usuario = UsuarioRepository.get_by_id(usuario_id)
        if not usuario:
            return None, "Usuario no encontrado"
        
        try:
            # Si se está actualizando el password, hashearlo
            if 'password' in data:
                data['password'] = generate_password_hash(data['password'])
            
            usuario = UsuarioRepository.update(usuario, data)
            return usuario, None
        except Exception as e:
            return None, str(e) 