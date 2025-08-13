import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2171b5',
      light: '#6baed6',
      dark: '#08519c',
    },
    secondary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    impact: {
      low: '#f7fbff',
      mediumLow: '#deebf7',
      medium: '#c6dbef',
      mediumHigh: '#9ecae1',
      high: '#6baed6',
      veryHigh: '#2171b5',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default theme;
