import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E3192', // Deep blue
      light: '#5D60C1',
      dark: '#1A1C66',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF9E1B', // Vibrant orange
      light: '#FFB74D',
      dark: '#E57200',
      contrastText: '#000000',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    info: {
      main: '#03A9F4',
      light: '#4FC3F7',
      dark: '#0288D1',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.05)',
    '0px 3px 3px -2px rgba(0,0,0,0.05),0px 2px 6px 0px rgba(0,0,0,0.03),0px 1px 8px 0px rgba(0,0,0,0.05)',
    '0px 3px 4px -2px rgba(0,0,0,0.05),0px 3px 8px 0px rgba(0,0,0,0.03),0px 1px 12px 0px rgba(0,0,0,0.05)',
    '0px 4px 5px -2px rgba(0,0,0,0.05),0px 4px 10px 0px rgba(0,0,0,0.03),0px 1px 16px 0px rgba(0,0,0,0.05)',
    '0px 5px 8px -3px rgba(0,0,0,0.05),0px 5px 12px 0px rgba(0,0,0,0.03),0px 2px 20px 0px rgba(0,0,0,0.05)',
    '0px 6px 10px -4px rgba(0,0,0,0.05),0px 7px 14px 0px rgba(0,0,0,0.03),0px 2px 24px 0px rgba(0,0,0,0.05)',
    '0px 7px 12px -4px rgba(0,0,0,0.05),0px 9px 16px 0px rgba(0,0,0,0.03),0px 3px 28px 0px rgba(0,0,0,0.05)',
    '0px 8px 14px -5px rgba(0,0,0,0.05),0px 11px 18px 0px rgba(0,0,0,0.03),0px 4px 32px 0px rgba(0,0,0,0.05)',
    '0px 9px 16px -6px rgba(0,0,0,0.05),0px 13px 20px 0px rgba(0,0,0,0.03),0px 5px 36px 0px rgba(0,0,0,0.05)',
    '0px 10px 18px -7px rgba(0,0,0,0.05),0px 15px 22px 0px rgba(0,0,0,0.03),0px 6px 40px 0px rgba(0,0,0,0.05)',
    '0px 11px 20px -8px rgba(0,0,0,0.05),0px 17px 24px 0px rgba(0,0,0,0.03),0px 7px 44px 0px rgba(0,0,0,0.05)',
    '0px 12px 22px -8px rgba(0,0,0,0.05),0px 19px 26px 0px rgba(0,0,0,0.03),0px 8px 48px 0px rgba(0,0,0,0.05)',
    '0px 13px 24px -9px rgba(0,0,0,0.05),0px 21px 28px 0px rgba(0,0,0,0.03),0px 9px 52px 0px rgba(0,0,0,0.05)',
    '0px 14px 26px -10px rgba(0,0,0,0.05),0px 23px 30px 0px rgba(0,0,0,0.03),0px 10px 56px 0px rgba(0,0,0,0.05)',
    '0px 15px 28px -11px rgba(0,0,0,0.05),0px 25px 32px 0px rgba(0,0,0,0.03),0px 11px 60px 0px rgba(0,0,0,0.05)',
    '0px 16px 30px -12px rgba(0,0,0,0.05),0px 27px 34px 0px rgba(0,0,0,0.03),0px 12px 64px 0px rgba(0,0,0,0.05)',
    '0px 17px 32px -13px rgba(0,0,0,0.05),0px 29px 36px 0px rgba(0,0,0,0.03),0px 13px 68px 0px rgba(0,0,0,0.05)',
    '0px 18px 34px -14px rgba(0,0,0,0.05),0px 31px 38px 0px rgba(0,0,0,0.03),0px 14px 72px 0px rgba(0,0,0,0.05)',
    '0px 19px 36px -15px rgba(0,0,0,0.05),0px 33px 40px 0px rgba(0,0,0,0.03),0px 15px 76px 0px rgba(0,0,0,0.05)',
    '0px 20px 38px -16px rgba(0,0,0,0.05),0px 35px 42px 0px rgba(0,0,0,0.03),0px 16px 80px 0px rgba(0,0,0,0.05)',
    '0px 21px 40px -17px rgba(0,0,0,0.05),0px 37px 44px 0px rgba(0,0,0,0.03),0px 17px 84px 0px rgba(0,0,0,0.05)',
    '0px 22px 42px -18px rgba(0,0,0,0.05),0px 39px 46px 0px rgba(0,0,0,0.03),0px 18px 88px 0px rgba(0,0,0,0.05)',
    '0px 23px 44px -19px rgba(0,0,0,0.05),0px 41px 48px 0px rgba(0,0,0,0.03),0px 19px 92px 0px rgba(0,0,0,0.05)',
    '0px 24px 46px -20px rgba(0,0,0,0.05),0px 43px 50px 0px rgba(0,0,0,0.03),0px 20px 96px 0px rgba(0,0,0,0.05)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minWidth: 100,
        },
      },
    },
  },
});

export default theme;