import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    code: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    code?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    code: true;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3a54aa',
    },
    secondary: {
      main: '#bb9047',
    },
    background: {
      default: '#e7ecf4',
    },
  },

  typography: {
    fontFamily: 'Lato, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    code: { fontFamily: 'Roboto Mono' },
  },
});
