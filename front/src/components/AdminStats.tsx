import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Button,
  Fade
} from '@mui/material';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import WeekendIcon from '@mui/icons-material/Weekend';
import GroupIcon from '@mui/icons-material/Group';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RefreshIcon from '@mui/icons-material/Refresh';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

interface Estadisticas {
  stats_generales: {
    total_peliculas: number;
    total_ventas_combos: number;
    total_salas: number;
    ocupacion_total: number;
    ingresos_totales: number;
    entradas_vendidas: number;
    total_miembros: number;
  };
  miembros_activos: {
    nombre: string;
    email: string;
    fecha_registro: string;
    total_reservas: number;
    total_compras: number;
    nivel_actividad: {
      nivel: string;
      color: string;
    };
  }[];
  peliculas_mas_vistas: {
    titulo: string;
    vistas: number;
    progreso: number;
    sala: string;
    horario: string;
    ingresos: number;
  }[];
  combos_mas_vendidos: {
    nombre: string;
    cantidad: number;
    progreso: number;
    ingresos: number;
  }[];
  salas_mas_demandadas: {
    sala: string;
    tipo: string;
    capacidad_total: number;
    distribucion_horaria: {
      hora: number;
      ocupacion: number;
      asientos_ocupados: number;
    }[];
    total_ocupacion: number;
  }[];
}

const AdminStats: React.FC<{ mode: 'dark' | 'light'; onModeChange: () => void }> = ({ mode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isExiting, setIsExiting] = useState(false);
  const [stats, setStats] = useState<Estadisticas>({
    stats_generales: {
      total_peliculas: 0,
      total_ventas_combos: 0,
      total_salas: 0,
      ocupacion_total: 0,
      ingresos_totales: 0,
      entradas_vendidas: 0,
      total_miembros: 0
    },
    miembros_activos: [],
    peliculas_mas_vistas: [],
    combos_mas_vendidos: [],
    salas_mas_demandadas: []
  });

  const handleLogout = async () => {
    setIsExiting(true);
    // Esperar 1 segundo antes de hacer logout
    await new Promise(resolve => setTimeout(resolve, 1000));
    logout();
    navigate('/');
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/estadisticas', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchStats, 300000);
    return () => clearInterval(interval);
  }, []);

  if (!user || user.es_miembro !== 1) {
    return (
      <Fade in timeout={1000}>
        <Box sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh'
        }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Redirigiendo...
          </Typography>
          <CircularProgress />
        </Box>
      </Fade>
    );
  }

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '80vh',
        p: 4 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'VES'
    }).format(amount);
  };

  const StatCard = ({ title, value, subtitle, icon, color }: { 
    title: string, 
    value: string, 
    subtitle?: string, 
    icon: React.ReactNode, 
    color: string 
  }) => (
    <Paper 
      elevation={3}
      sx={{
        p: 1.5,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
        color: mode === 'dark' ? 'white' : 'inherit'
      }}
    >
      <Box sx={{ mr: 1.5, color }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="textSecondary" noWrap>{title}</Typography>
        <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>{value}</Typography>
        {subtitle && (
          <Typography variant="caption" color="textSecondary" noWrap>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );

  return (
    <Fade in={!isExiting} timeout={1000}>
      <Box sx={{ p: 4, bgcolor: mode === 'dark' ? '#0a1929' : '#f5f5f5', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: mode === 'dark' ? 'white' : 'black' }}>
            Panel de Administración
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" sx={{ color: mode === 'dark' ? 'white' : 'black' }}>
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </Typography>
            <Tooltip title="Actualizar estadísticas">
              <IconButton onClick={fetchStats} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cerrar sesión">
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ ml: 2 }}
              >
                Cerrar Sesión
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Tarjetas de resumen */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={1.714}>
            <StatCard 
              title="Películas Activas" 
              value={stats.stats_generales.total_peliculas.toString()}
              subtitle="En cartelera"
              icon={<MovieIcon fontSize="large" />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} lg={1.714}>
            <StatCard 
              title="Entradas Vendidas" 
              value={stats.stats_generales.entradas_vendidas.toString()}
              subtitle="Últimas 24h"
              icon={<ConfirmationNumberIcon fontSize="large" />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} lg={1.714}>
            <StatCard 
              title="Ventas de Combos" 
              value={stats.stats_generales.total_ventas_combos.toString()}
              subtitle="Últimas 24h"
              icon={<FastfoodIcon fontSize="large" />}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} lg={1.714}>
            <StatCard 
              title="Salas Activas" 
              value={stats.stats_generales.total_salas.toString()}
              subtitle="En operación"
              icon={<WeekendIcon fontSize="large" />}
              color="#9c27b0"
            />
          </Grid>
          <Grid item xs={12} lg={1.714}>
            <StatCard 
              title="Ocupación Total" 
              value={`${stats.stats_generales.ocupacion_total}%`}
              subtitle="Promedio diario"
              icon={<GroupIcon fontSize="large" />}
              color="#0288d1"
            />
          </Grid>
          <Grid item xs={12} lg={1.714}>
            <StatCard 
              title="Ingresos Totales" 
              value={formatCurrency(stats.stats_generales.ingresos_totales)}
              subtitle="Últimas 24h"
              icon={<AttachMoneyIcon fontSize="large" />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} lg={1.714}>
            <StatCard 
              title="Miembros BH" 
              value={stats.stats_generales.total_miembros.toString()}
              subtitle="Miembros activos"
              icon={<PeopleIcon fontSize="large" />}
              color="#9c27b0"
            />
          </Grid>
        </Grid>

        {/* Nueva sección: Tabla de Miembros Activos */}
        <Card sx={{ mb: 4, bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: mode === 'dark' ? 'white' : 'black' }}>
              Miembros BH Activos
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>Miembro</TableCell>
                    <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>Fecha Registro</TableCell>
                    <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>Reservas</TableCell>
                    <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>Compras</TableCell>
                    <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>Nivel de Actividad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.miembros_activos.map((miembro, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: miembro.nivel_actividad.color }}>
                            {miembro.nombre.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {miembro.nombre}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {miembro.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>
                        {new Date(miembro.fecha_registro).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>
                        {miembro.total_reservas}
                      </TableCell>
                      <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>
                        {miembro.total_compras}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={miembro.nivel_actividad.nivel}
                          sx={{ 
                            bgcolor: miembro.nivel_actividad.color,
                            color: 'white'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Tabla de Películas Más Vistas */}
        <Card sx={{ mb: 4, bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: mode === 'dark' ? 'white' : 'black' }}>
              Top Películas
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>Película</TableCell>
                    <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>Entradas</TableCell>
                    <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>Ingresos</TableCell>
                    <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>Ocupación</TableCell>
                    <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>Tendencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.peliculas_mas_vistas.map((pelicula, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {pelicula.titulo}
                          </Typography>
                          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                            {pelicula.sala} - {pelicula.horario}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>
                        {pelicula.vistas}
                      </TableCell>
                      <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>
                        {formatCurrency(pelicula.ingresos)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={pelicula.progreso} 
                              sx={{ 
                                height: 8, 
                                borderRadius: 5,
                                backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: index === 0 ? '#2e7d32' : index === 1 ? '#ed6c02' : '#1976d2'
                                }
                              }} 
                            />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" sx={{ color: mode === 'dark' ? 'white' : 'black' }}>
                              {`${Math.round(pelicula.progreso)}%`}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: mode === 'dark' ? 'white' : 'black' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: pelicula.progreso > 80 ? '#2e7d32' : pelicula.progreso > 50 ? '#ed6c02' : '#d32f2f'
                          }}
                        >
                          {pelicula.progreso > 80 ? '↑ Alta' : pelicula.progreso > 50 ? '→ Media' : '↓ Baja'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Estadísticas detalladas */}
        <Grid container spacing={3}>
          {/* Combos Más Vendidos */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: mode === 'dark' ? 'white' : 'black' }}>
                  Top Ventas de Combos
                </Typography>
                {stats.combos_mas_vendidos.map((combo, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box>
                        <Typography sx={{ color: mode === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>
                          {combo.nombre}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {combo.cantidad} unidades • {formatCurrency(combo.ingresos)}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: combo.progreso > 80 ? '#2e7d32' : combo.progreso > 50 ? '#ed6c02' : '#d32f2f'
                        }}
                      >
                        {combo.progreso > 80 ? '↑' : combo.progreso > 50 ? '→' : '↓'} {combo.progreso}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={combo.progreso} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 5,
                        backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: index === 0 ? '#2e7d32' : index === 1 ? '#ed6c02' : '#1976d2'
                        }
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Salas Más Demandadas con Gráfico Circular */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: mode === 'dark' ? 'white' : 'black' }}>
                  Ocupación por Salas
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Chip 
                    label="Standard" 
                    sx={{ bgcolor: '#2e7d32', color: 'white' }} 
                  />
                  <Chip 
                    label="Gold" 
                    sx={{ bgcolor: '#ed6c02', color: 'white' }} 
                  />
                  <Chip 
                    label="VIP" 
                    sx={{ bgcolor: '#d32f2f', color: 'white' }} 
                  />
                </Box>
                {stats.salas_mas_demandadas.map((sala, index) => (
                  <Box key={index} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box>
                        <Typography sx={{ color: mode === 'dark' ? 'white' : 'black', fontWeight: 'bold' }}>
                          {sala.sala}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="textSecondary">
                            Capacidad total: {sala.capacidad_total} asientos
                          </Typography>
                          <Chip 
                            label={sala.tipo} 
                            size="small"
                            sx={{ 
                              bgcolor: sala.tipo === 'standard' 
                                ? '#2e7d32' 
                                : sala.tipo === 'gold' 
                                ? '#ed6c02' 
                                : '#d32f2f',
                              color: 'white',
                              height: 20,
                              '& .MuiChip-label': {
                                px: 1,
                                py: 0,
                                fontSize: '0.7rem'
                              }
                            }} 
                          />
                        </Box>
                      </Box>
                      <Box sx={{ position: 'relative', width: 60, height: 60 }}>
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          sx={{
                            position: 'absolute',
                            color: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                          }}
                          size={60}
                        />
                        <CircularProgress
                          variant="determinate"
                          value={sala.total_ocupacion / sala.distribucion_horaria.length}
                          sx={{
                            position: 'absolute',
                            color: sala.tipo === 'standard'
                              ? '#2e7d32'
                              : sala.tipo === 'gold'
                              ? '#ed6c02'
                              : '#d32f2f'
                          }}
                          size={60}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            component="div"
                            sx={{ color: mode === 'dark' ? 'white' : 'black' }}
                          >
                            {`${Math.round(sala.total_ocupacion / sala.distribucion_horaria.length)}%`}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {sala.distribucion_horaria.map((hora, horaIndex) => (
                        <Tooltip 
                          key={horaIndex}
                          title={`${hora.hora}:00 - ${hora.asientos_ocupados} asientos ocupados`}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              bgcolor: sala.tipo === 'standard'
                                ? '#2e7d32'
                                : sala.tipo === 'gold'
                                ? '#ed6c02'
                                : '#d32f2f',
                              opacity: hora.ocupacion / 100,
                              cursor: 'pointer'
                            }}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default AdminStats;