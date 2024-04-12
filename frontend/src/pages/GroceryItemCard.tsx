import React, { useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  Grid,
} from '@mui/material';
import { GroceryItem } from '../@types/GroceryItemContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { APIGroceryItem } from '../utils/api-grocery-item';
import { STATUS_OK } from '../constants';
import { useSnackbar } from '../context/SnackbarContext';
import ConfirmationDialog from '../components/modal/ConfirmationDialog';
import UpdateGroceryItemDialog from '../components/modal/grocery-item/UpdateGroceryItemDialog';
import APIGroceryList from '../utils/api-grocery-list';
import { useHome } from '../context/HomeContext';
import { useNavigate } from 'react-router-dom';
import { useSockets } from '../context/SocketContext';
import { homeSocketEvents as events } from '../constants';

type ItemProps = {
  item: GroceryItem;
  getGroceryList: () => void;
};

function GroceryItemCard(props: ItemProps) {
  const { item, getGroceryList } = props;
  const [updateItemDialogOpen, setUpdateItemDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const snackBar = useSnackbar();
  const home = useHome();
  const navigate = useNavigate();
  const { homeSocket } = useSockets();

  const handleOpenUpdateItem = (event: React.MouseEvent<HTMLElement>) => {
    setUpdateItemDialogOpen(true);
    getGroceryList();
  };

  const handleOpenDeleteItem = (event: React.MouseEvent<HTMLElement>) => {
    setConfirmDeleteDialogOpen(true);
  };

  const handleDeleteItem = () => {
    const currItem = item;
    console.log(item);
    APIGroceryItem.deleteItem(item._id)
      .then(({ data: { item, message }, status }) => {
        if (status !== STATUS_OK) throw new Error(message);
        removeItemFromList(currItem);
        snackBar.setSuccess(`Item ${currItem.name} successfully deleted`, 2000);
      })
      .catch((err) => snackBar.setError(err.toString()))
      .finally(getGroceryList);
  };

  const removeItemFromList = (item: GroceryItem) => {
    console.log(item);
    if (!home) return;
    APIGroceryList.removeItemFromList(home._id, item._id)
      .then(({ data: { list, message }, status }) => {
        if (status !== STATUS_OK) throw Error(message);
        setConfirmDeleteDialogOpen(false);
        navigate('/grocery-list');
        homeSocket.emit(events.UPDATE_GROCERIES, home?._id);
      })
      .catch((err) => {
        snackBar.setError(err.toString());
      });
  };

  return (
    <Card sx={{ textAlign: 'left' }}>
      <CardContent>
        <Typography>
          <b>User : </b>
          {item.user?.username}
        </Typography>
        <Typography>
          <b>Item Name : </b>
          {item.name}
        </Typography>
        <Typography>
          <b>Purchase Date : </b>
          {new Date(item.purchasedDate).toDateString()}
        </Typography>
        <Typography>
          <b>Expiry Date : </b>
          {new Date(item.expiryDate).toDateString()}
        </Typography>
        <Typography>
          <b>Quantity : </b>
          {item.quantity} {item.unit}
        </Typography>
        <Typography>
          <b>Category : </b>
          {item.category}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid container justifyContent='flex-end'>
          <IconButton onClick={handleOpenUpdateItem} color='inherit'>
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleOpenDeleteItem} color='inherit'>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </CardActions>

      <ConfirmationDialog
        dialogOpen={confirmDeleteDialogOpen}
        setDialogOpen={setConfirmDeleteDialogOpen}
        message={'Confirm deleting this item?'}
        onConfirmAction={handleDeleteItem}
      />

      <UpdateGroceryItemDialog
        groceryItem={item}
        dialogOpen={updateItemDialogOpen}
        setDialogOpen={setUpdateItemDialogOpen}
        getGroceryList={getGroceryList}
      />
    </Card>
  );
}

export default GroceryItemCard;
