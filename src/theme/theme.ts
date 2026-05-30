import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FFEB3B',
    },
    info: {
      main: '#2196F3',
    },
    success: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      color: 'text.primary',
      background: 'linear-gradient(135deg, #4CAF50 0%, #FF9800 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      color: 'text.primary',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      color: 'text.primary',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: 'text.primary',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: 'text.primary',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: 'text.primary',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: 'text.secondary',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: 'text.secondary',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #4CAF50 0%, #FF9800 100%)',
          boxShadow: '0 4px 20px 0 rgba(76, 175, 80, 0.3)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        },
        contained: {
          background: 'linear-gradient(135deg, #4CAF50 0%, #FF9800 100%)',
          boxShadow: '0 6px 20px 0 rgba(76, 175, 80, 0.3)',
          '&:hover': {
            boxShadow: '0 12px 40px 0 rgba(76, 175, 80, 0.5)',
            transform: 'translateY(-2px)',
            background: 'linear-gradient(135deg, #FF9800 0%, #4CAF50 100%)',
          },
          '&:active': {
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(76, 175, 80, 0.5)',
          color: 'primary.main',
          '&:hover': {
            borderColor: 'primary.main',
            background: 'rgba(76, 175, 80, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(76, 175, 80, 0.2)',
          '&:hover': {
            boxShadow: '0 12px 36px 0 rgba(76, 175, 80, 0.25)',
            transform: 'translateY(-6px)',
            borderColor: 'rgba(76, 175, 80, 0.5)',
            background: 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.3s ease',
            color: 'text.primary',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            '&:hover': {
              borderColor: 'rgba(76, 175, 80, 0.5)',
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            },
            '&.Mui-focused': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)',
            },
          },
          '& .MuiOutlinedInput-input::placeholder': {
            color: 'text.secondary',
            opacity: 1,
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          '& .MuiTableCell-head': {
            fontWeight: 800,
            color: 'primary.main',
            borderBottom: '2px solid rgba(76, 175, 80, 0.3)',
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#F5F5F5',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '0.95rem',
          fontWeight: 500,
        },
        standardInfo: {
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          color: '#64B5F6',
          border: '1px solid rgba(33, 150, 243, 0.3)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          color: '#A5D6A7',
          border: '1px solid rgba(76, 175, 80, 0.3)',
        },
      },
    },
  },
});

export default theme;
