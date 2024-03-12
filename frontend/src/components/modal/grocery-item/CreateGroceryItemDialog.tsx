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
import { STATUS_CREATED } from '../../../constants';
import dayjs from 'dayjs';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useUser } from '../../../context/UserContext';

const Unit: string[] = ['pc', 'kg', 'lb', 'L'];


const Category: string[] = [
    'Meat',
    'Seafood',
    'Vegetable',
    'Fruit',
    'Snack',
    'Dairy/Egg',
    'Frozen',
    'Condiment/Seasoning',
    'Fermented',
    'Beverage'
]

type CreateGroceryItemDialogProps = {
    dialogOpen: boolean;
    setDialogOpen: (isOpen: boolean) => void;
};

function CreateGroceryItemDialog(props: CreateGroceryItemDialogProps) {
    const { dialogOpen, setDialogOpen } = props;
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [unit, setUnit] = React.useState('');
    const [category, setCategory] = React.useState('');

    const user = useUser();
    const snackBar = useSnackbar();

    const handleUnitChange = (event: SelectChangeEvent) => {
        setUnit(event.target.value as string);
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };


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

        if (!user_id || !name || !purchasedDate || !expiryDate || !quantity || !unit || !category) {
            return;
        }

        const body = {
            user: user_id.toString(),
            name: name.toString(),
            purchasedDate: new Date(purchasedDate.toString()),
            expiryDate: new Date(expiryDate.toString()),
            quantity: Number.parseInt(quantity.toString()),
            unit: unit.toString(),
            category: category.toString()
        };

        setLoading(true);
        APIGroceryItem.createItem(body)
            .then(({ data: { item, message }, status }) => {
                if (status !== STATUS_CREATED) throw new Error(message);

                // success
                setDialogOpen(false);
                snackBar.setSuccess(`Item ${item.name} successfully created`, 2000);
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
            <DialogTitle>Create Grocery Item</DialogTitle>

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
                        />
                    </Grid>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid item xs={12}>
                            <DatePicker
                                name='purchasedDate'
                                label='Purchase Date'
                                defaultValue={dayjs()} />
                        </Grid>
                        <Grid item xs={12}>
                            <DatePicker
                                name='expiryDate'
                                label='Expiry Date'
                                defaultValue={dayjs()} />
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
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel id="unit-select">Unit</InputLabel>
                        <Select
                            labelId="unit"
                            id="unit"
                            value={unit}
                            onChange={handleUnitChange}
                            label="Unit"
                        >
                            {Unit.map(
                                unit => <MenuItem value={unit}>{unit}</MenuItem>
                            )}
                        </Select>
                    </Grid>

                    <Grid item xs={12}>
                        <InputLabel id="category-select">Category</InputLabel>
                        <Select
                            labelId="category"
                            id="category"
                            value={category}
                            onChange={handleCategoryChange}
                            label="Category"
                        >
                            {Category.map(
                                cat => <MenuItem value={cat}>{cat}</MenuItem>
                            )}
                        </Select>
                    </Grid>

                    <Grid
                        item
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        xs={12}
                    >
                        <Button variant='contained' type='submit' disabled={loading}>
                            {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Dialog>
    );
}

export default CreateGroceryItemDialog;
