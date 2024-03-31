import React, { useEffect, useState, useCallback } from 'react';
import { IconButton, Grid, Stack, Typography } from '@mui/material';
import APIGroceryList from '../utils/api-grocery-list';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateGroceryItemDialog from '../components/modal/grocery-item/CreateGroceryItemDialog';
import GroceryItemCard from './GroceryItemCard';
import { useHome } from '../context/HomeContext';
import { STATUS_OK } from '../constants';
import { GroceryItem } from '../@types/GroceryItemContext';
import { useSockets } from '../context/SocketContext';
import { homeSocketEvents as events } from '../constants';
import { useSnackbar } from '../context/SnackbarContext';

function GroceryListPage() {
  const [createItemDialogOpen, setCreateItemDialogOpen] = useState(false);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>();
  const home = useHome();
  const { homeSocket } = useSockets();
  const snackbar = useSnackbar();

  const getGroceryList = useCallback(() => {
    if (!home) return;
    APIGroceryList.getListByHomeId(home._id)
      .then(({ data: { list, message }, status }) => {
        if (status !== STATUS_OK) throw Error(message);
        setGroceryList(list.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [home]);

  const updateGrocery = useCallback(() => {
    if (!home) return;
    APIGroceryList.getListByHomeId(home._id).then(
      ({ data: { list, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        if (list) {
          setGroceryList(list.items);
        }
      }
    );
  }, [home, snackbar]);

  useEffect(getGroceryList, [getGroceryList]);

  useEffect(() => {
    homeSocket.on(events.UPDATE_GROCERIES, updateGrocery);
    return () => {
      homeSocket.off(events.UPDATE_EXPENSES, updateGrocery);
    };
  }, [homeSocket, updateGrocery]);

  const handleOpenCreateItem = (event: React.MouseEvent<HTMLElement>) => {
    setCreateItemDialogOpen(true);
  };

  return (
    <Stack justifyContent='center' alignItems='center' spacing={2}>
      <Typography variant='h4'>Grocery List</Typography>

      {home?._id &&
        groceryList?.map((item, i) => (
          <GroceryItemCard
            key={i}
            item={item}
            getGroceryList={getGroceryList}
          />
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
        updateGrocery={updateGrocery}
      />
    </Stack>
  );
}

export default GroceryListPage;
