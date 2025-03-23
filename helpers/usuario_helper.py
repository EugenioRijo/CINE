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