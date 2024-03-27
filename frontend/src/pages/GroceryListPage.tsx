import React, { useEffect, useState } from 'react';
import { IconButton, Grid, Stack, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import APIGroceryList from '../utils/api-grocery-list';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateGroceryItemDialog from '../components/modal/grocery-item/CreateGroceryItemDialog';
import GroceryItemCard from './GroceryItemCard';
import { useHome } from '../context/HomeContext';
import { STATUS_OK } from '../constants';
import { GroceryItem } from '../@types/GroceryItemContext';

function GroceryListPage() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [createItemDialogOpen, setCreateItemDialogOpen] = useState(false);
    const [groceryList, setGroceryList] = useState<GroceryItem[]>();
    const theme = createTheme();
    const home = useHome();
    const homeId = home ? home._id : "";

    useEffect(() => {
        getGroceryList();
    }, [])

    const getGroceryList = () => {
        APIGroceryList.getListByHomeId(homeId).then(
            ({ data: { list, message }, status }) => {
                if (status !== STATUS_OK) throw Error(message);
                setGroceryList(list.items);
            }
        );
    }

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

                {groceryList?.map(
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