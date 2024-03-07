import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Button,
  Divider,
} from '@mui/material';
import { Close } from '@mui/icons-material';

type ConfirmationDialogProps = {
  message: string;
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
  onConfirmAction: () => void;
};

function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { message, dialogOpen, setDialogOpen, onConfirmAction } = props;

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>Confirm the action</DialogTitle>

      <Box position='absolute' top={0} right={0}>
        <IconButton onClick={() => setDialogOpen(false)}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button
          color='primary'
          variant='outlined'
          onClick={() => setDialogOpen(false)}
        >
          Cancel
        </Button>

        <Button variant='contained' onClick={onConfirmAction}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
