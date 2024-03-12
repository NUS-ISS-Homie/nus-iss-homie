import React, { useState } from "react";
import { Card, CardActions, CardContent, IconButton, Typography } from "@mui/material";
import { GroceryItem } from "../@types/GroceryItemContext";
import { Box } from "@mui/system";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { APIGroceryItem } from '../utils/api-grocery-item';
import { STATUS_OK } from '../constants';
import { useSnackbar } from "../context/SnackbarContext";
import ConfirmationDialog from '../components/modal/ConfirmationDialog';
import UpdateGroceryItemDialog from '../components/modal/grocery-item/UpdateGroceryItemDialog';

type ItemProps = {
    item: GroceryItem
}

function GroceryItemCard(props: ItemProps) {
    const { item } = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [updateItemDialogOpen, setUpdateItemDialogOpen] = useState(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const snackBar = useSnackbar();

    const handleOpenUpdateItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setUpdateItemDialogOpen(true);
    };

    const handleOpenDeleteItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setConfirmDeleteDialogOpen(true);
    }

    const handleDeleteItem = () => {
        setLoading(true);
        APIGroceryItem.deleteItem(item.name)
            .then(({ data: { item, message }, status }) => {
                if (status !== STATUS_OK) throw new Error(message);
                snackBar.setSuccess(`Item ${item.name} successfully deleted`, 2000);
            })
            .catch((err) => {
                snackBar.setError(err.toString());
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Card>
            <CardContent>
                <Typography>{item.name}</Typography>
                <Typography>{item.purchasedDate.toDateString()}</Typography>
                <Typography>{item.expiryDate.toDateString()}</Typography>
                <Typography>{item.quantity} {item.unit}</Typography>
                <Typography>{item.category}</Typography>
            </CardContent>
            <CardActions>
                <>
                    <IconButton onClick={handleOpenUpdateItem} color='inherit'>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleOpenDeleteItem} color='inherit'>
                        <DeleteIcon />
                    </IconButton>
                </>
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
            />

        </Card>
    );
}

export default GroceryItemCard;