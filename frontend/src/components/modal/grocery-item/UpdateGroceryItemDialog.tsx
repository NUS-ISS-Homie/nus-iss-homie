import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useSnackbar } from '../../../context/SnackbarContext';
import { APIGroceryItem } from '../../../utils/api-grocery-item';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { STATUS_OK } from '../../../constants';
import dayjs from 'dayjs';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { GroceryItem } from '../../../@types/GroceryItemContext';
import { Unit, Category } from '../../../enums';
import { useUser } from '../../../context/UserContext';

type UpdateGroceryItemDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
  groceryItem: GroceryItem;
};

function UpdateGroceryItemDialog(props: UpdateGroceryItemDialogProps) {
  const { dialogOpen, setDialogOpen, groceryItem } = props;
  const [loading, setLoading] = useState(false);
  const [itemState, setItemState] = useState(groceryItem);

  const handleItemChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setItemState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const snackBar = useSnackbar();
  const user = useUser();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user_id = user.user_id;

    const name = data.get('name');
    const purchasedDate = data.get('purchasedDate');
    const expiryDate = data.get('expiryDate');
    const quantity = data.get('quantity');
    const unit = data.get('unit');
    const category = data.get('category');

    if (
      !user_id ||
      !name ||
      !purchasedDate ||
      !expiryDate ||
      !quantity ||
      !unit ||
      !category
    ) {
      return;
    }

    const body = {
      user: user_id,
      name: name.toString(),
      purchasedDate: new Date(purchasedDate.toString()),
      expiryDate: new Date(expiryDate.toString()),
      quantity: Number.parseInt(quantity.toString()),
      unit: unit.toString(),
      category: category.toString(),
    };
    console.log(body);
    setLoading(true);
    APIGroceryItem.updateItem(itemState._id, body)
      .then(({ data: { item, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);

        // success
        setDialogOpen(false);
        snackBar.setSuccess(
          `Item ${itemState.name} successfully updated`,
          2000
        );
      })
      .catch((err) => {
        snackBar.setError(err.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>Update Grocery Item</DialogTitle>

      <Box position='absolute' top={0} right={0}>
        <IconButton onClick={() => setDialogOpen(false)}>
          <Close />
        </IconButton>
      </Box>

      <Box
        sx={{
          paddingLeft: 5,
          paddingRight: 5,
          paddingBottom: 5,
        }}
        component='form'
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              placeholder='Name'
              required
              fullWidth
              id='name'
              label='name'
              name='name'
              type='text'
              defaultValue={itemState.name}
            />
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid item xs={12}>
              <DatePicker
                name='purchasedDate'
                label='Purchase Date'
                value={dayjs(groceryItem.purchasedDate)}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                name='expiryDate'
                label='Expiry Date'
                value={dayjs(groceryItem.expiryDate)}
              />
            </Grid>
          </LocalizationProvider>
          <Grid item xs={12}>
            <TextField
              placeholder='Quantity'
              required
              fullWidth
              id='quantity'
              label='quantity'
              name='quantity'
              type='number'
              defaultValue={itemState.quantity}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id='unit-select'>Unit</InputLabel>
            <Select
              labelId='unit'
              id='unit'
              name='unit'
              label='Unit'
              value={itemState.unit}
              onChange={handleItemChange}
            >
              {Unit.map((unit) => (
                <MenuItem value={unit}>{unit}</MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <InputLabel id='category-select'>Category</InputLabel>
            <Select
              labelId='category'
              id='category'
              value={itemState.category}
              name='category'
              label='Category'
              onChange={handleItemChange}
            >
              {Category.map((cat) => (
                <MenuItem value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid
            item
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
            xs={12}
          >
            <Button variant='contained' type='submit' disabled={loading}>
              {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
              Update
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

export default UpdateGroceryItemDialog;
