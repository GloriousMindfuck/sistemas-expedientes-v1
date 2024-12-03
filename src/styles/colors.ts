export const MunicipalidadColors = {
  // Colores principales
  primary: {
    50: '#E6F1FF',
    100: '#B3D7FF',
    200: '#80BDFF',
    300: '#4DA3FF',
    400: '#1A89FF',
    500: '#0070E0',  // Color base
    600: '#005AB3',
    700: '#004080',
    800: '#002B55',
    900: '#001C38'
  },
  
  // Colores pasteles
  pastel: {
    white: '#FFFFFF',
    black: '#000000',
    softBlue: '#E6F2FF',
    softGreen: '#E6F5E6',
    softPink: '#FFE6F2',
    softYellow: '#FFF5E6',
    softLavender: '#E6E6FF',
    softMint: '#E6FFF0',
    softPeach: '#FFF0E6',
    softGray: '#F5F5F5'
  },

  // Estados de expediente
  status: {
    open: '#4CAF50',     // Verde
    closed: '#2196F3',   // Azul
    pending: '#FF9800',  // Naranja
    signed: '#9C27B0',   // Púrpura
    paid: '#00BCD4'      // Cyan
  },

  // Biblioratos y carpetas
  folders: {
    blue: '#3F51B5',
    green: '#4CAF50',
    red: '#F44336',
    yellow: '#FFEB3B',
    purple: '#9C27B0'
  }
};

// Función para generar número de expediente
export const generarNumeroExpediente = (numero?: number, año?: number): string => {
  const currentYear = año || new Date().getFullYear();
  const currentNumero = numero || Math.floor(Math.random() * 9999) + 1;
  return `${String(currentNumero).padStart(4, '0')}/${currentYear}`;
};

// Función para convertir color a fondo
export const getBackgroundColor = (color: string): string => {
  const pastelColors: { [key: string]: string } = {
    'Blanco': '#FFFFFF',
    'Negro': '#000000',
    'Rosa Claro': '#FFE4E1',
    'Azul Claro': '#E6F2FF',
    'Verde Claro': '#E6FFE6',
    'Amarillo Claro': '#FFFAE6',
    'Lavanda': '#E6E6FA',
    'Melocotón': '#FFDAB9',
    'Celeste': '#B0E0E6',
    'Menta': '#F5FFFA'
  };
  return pastelColors[color] || color;
};
