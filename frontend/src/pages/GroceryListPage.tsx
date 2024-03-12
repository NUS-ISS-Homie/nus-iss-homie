import React, { useState } from 'react';
import { IconButton, Grid, Stack, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateGroceryItemDialog from '../components/modal/grocery-item/CreateGroceryItemDialog';
import GroceryItemCard from './GroceryItemCard';

function GroceryListPage() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [createItemDialogOpen, setCreateItemDialogOpen] = useState(false);
    const theme = createTheme();

    const groceryItems = [
        {
            user: {
                user_id: 'hoho',
                username: 'hoho'
            },
            name: "Milk",
            purchasedDate: new Date(),
            expiryDate: new Date(),
            quantity: 2,
            unit: 'L',
            category: 'Dairy/Egg'
        },
        {
            user: {
                user_id: 'hihi',
                username: 'hihi'
            },
            name: "Nugget",
            purchasedDate: new Date(),
            expiryDate: new Date(),
            quantity: 1,
            unit: "pc",
            category: "Frozen"
        }
    ]

    // TODO : Call API to get a list of all grocery items of the house

    const handleOpenCreateItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setCreateItemDialogOpen(true);
    };

    return (
        <ThemeProvider theme={theme}>
            <Stack
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <Typography variant='h4'>Grocery List</Typography>

                {groceryItems.map(
                    item => <GroceryItemCard item={item} />
                )}

                <Grid container justifyContent='flex-end' padding={2}>
                    <IconButton size='large' edge='end' onClick={handleOpenCreateItem} color='inherit'>
                        <AddCircleIcon />
                    </IconButton>
                </Grid>

                <CreateGroceryItemDialog
                    dialogOpen={createItemDialogOpen}
                    setDialogOpen={setCreateItemDialogOpen}
                />
            </Stack >
        </ThemeProvider>
    );
}

export default GroceryListPage;