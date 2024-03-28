import React, { useEffect, useState, useCallback } from 'react';
import { IconButton, Grid, Stack, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import APIGroceryList from '../utils/api-grocery-list';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateGroceryItemDialog from '../components/modal/grocery-item/CreateGroceryItemDialog';
import GroceryItemCard from './GroceryItemCard';
import { useHome } from '../context/HomeContext';
import { STATUS_OK } from '../constants';
import { GroceryItem } from '../@types/GroceryItemContext';
import { useUser } from '../context/UserContext';

function GroceryListPage() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [createItemDialogOpen, setCreateItemDialogOpen] = useState(false);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>();
  const theme = createTheme();
  const home = useHome();
  const user = useUser();

  const getGroceryList = useCallback((homeId: string) => {
    APIGroceryList.getListByHomeId(homeId)
      .then(({ data: { list, message }, status }) => {
        if (status !== STATUS_OK) throw Error(message);
        setGroceryList(list.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!home) return;
    const homeId = home._id;
    getGroceryList(homeId);
  }, [getGroceryList, groceryList, home]);

  const handleOpenCreateItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setCreateItemDialogOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack justifyContent='center' alignItems='center' spacing={2}>
        <Typography variant='h4'>Grocery List</Typography>

        {home?._id &&
          groceryList?.map((item) => (
            <GroceryItemCard item={item} getGroceryList={getGroceryList} />
          ))}

        <Grid container justifyContent='flex-end' padding={2}>
          <IconButton
            size='large'
            edge='end'
            onClick={handleOpenCreateItem}
            color='inherit'
          >
            <AddCircleIcon />
          </IconButton>
        </Grid>

        <CreateGroceryItemDialog
          dialogOpen={createItemDialogOpen}
          setDialogOpen={setCreateItemDialogOpen}
          getGroceryList={getGroceryList}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default GroceryListPage;
