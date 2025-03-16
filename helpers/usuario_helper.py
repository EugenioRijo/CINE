"""
@file: helpers/usuario_helper.py
@description: Implementa la lógica de negocio para operaciones con usuarios

Este helper actúa como una capa intermedia entre los controladores/rutas y el repositorio,
implementando la lógica de negocio necesaria para el manejo de usuarios.

@methods:
    registrar_usuario(nombre, email, password):
        Registra un nuevo usuario en el sistema
        Parámetros:
            - nombre (str): Nombre del usuario
            - email (str): Email único del usuario
            - password (str): Contraseña sin hashear
        Retorna: 
            tuple (Usuario, str):
                - Éxito: (usuario_creado, None)
                - Error: (None, mensaje_error)
        
    actualizar_usuario(usuario_id, data):
        Actualiza los datos de un usuario existente
        Parámetros:
            - usuario_id (int): ID del usuario
            - data (dict): Datos a actualizar
        Retorna:
            tuple (Usuario, str):
                - Éxito: (usuario_actualizado, None)
                - Error: (None, mensaje_error)

@validaciones:
    - Verifica existencia de email duplicado
    - Hashea contraseñas antes de almacenar
    - Valida existencia de usuario antes de actualizar

@dependencies:
    - repositories.usuario_repository.UsuarioRepository
    - werkzeug.security.generate_password_hash
"""

from repositories.usuario_repository import UsuarioRepository
from werkzeug.security import generate_password_hash

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
            password (str): Contraseña sin hashear
            
        Returns:
            tuple: (Usuario, error_message)
            - Si el registro es exitoso: (usuario, None)
            - Si hay error: (None, mensaje_error)
        """
        # Verificar si el usuario ya existe
        if UsuarioRepository.get_by_email(email):
            return None, "El email ya está registrado"
        
        # Hashear el password
        hashed_password = generate_password_hash(password)
        
        # Crear el usuario
        try:
            usuario = UsuarioRepository.create(
                nombre=nombre,
                email=email,
                password=hashed_password
            )
            return usuario, None
        except Exception as e:
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