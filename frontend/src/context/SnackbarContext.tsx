import React, { createContext, useState, useContext } from 'react';
import Alert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const SnackbarContext = createContext({
  setSuccess: (message: string, duration?: number) => {},
  setError: (message: string, duration?: number) => {},
});

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const DEFAULT_DURATION = 5000;

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarDuration, setSnackbarDuration] = useState(DEFAULT_DURATION);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    AlertColor | undefined
  >();

  const handleOnClose = () => {
    setOpenSnackbar(false);
    setSnackbarDuration(DEFAULT_DURATION);
  };

  const setSuccess = (message: string, duration?: number) => {
    if (duration) setSnackbarDuration(duration);
    setSnackbarSeverity('success');
    setSnackbarMsg(message);
    setOpenSnackbar(true);
  };

  const setError = (message: string, duration?: number) => {
    if (duration) setSnackbarDuration(duration);
    setSnackbarSeverity('error');
    setSnackbarMsg(message);
    setOpenSnackbar(true);
  };

  return (
    <SnackbarContext.Provider
      value={{
        setSuccess,
        setError,
      }}
    >
      {children}
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={snackbarDuration}
          onClose={handleOnClose}
        >
          <Alert
            onClose={handleOnClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
            elevation={6}
            variant='filled'
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
}

const useSnackbar = () => useContext(SnackbarContext);

export { useSnackbar };
