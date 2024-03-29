import React, { useEffect, useState, useCallback } from 'react';
import { IconButton, Grid, Stack, Typography } from '@mui/material';
import APIGroceryList from '../utils/api-grocery-list';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateGroceryItemDialog from '../components/modal/grocery-item/CreateGroceryItemDialog';
import GroceryItemCard from './GroceryItemCard';
import { useHome } from '../context/HomeContext';
import { STATUS_OK } from '../constants';
import { GroceryItem } from '../@types/GroceryItemContext';

function GroceryListPage() {
  const [createItemDialogOpen, setCreateItemDialogOpen] = useState(false);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>();
  const home = useHome();

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

  useEffect(getGroceryList, [getGroceryList]);

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
      />
    </Stack>
  );
}

export default GroceryListPage;
