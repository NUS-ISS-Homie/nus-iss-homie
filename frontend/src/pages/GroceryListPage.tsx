import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateGroceryItemDialog from '../components/modal/grocery-item/CreateGroceryItemDialog';
import GroceryItemCard from './GroceryItemCard';
function GroceryListPage() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [createItemDialogOpen, setCreateItemDialogOpen] = useState(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const groceryItems = [
        {
            user_id: "ohohoho",
            name: "Milk",
            purchasedDate: new Date(),
            expiryDate: new Date(),
            quantity: 2,
            unit: 'L',
            category: 'Dairy/Egg'
        },
        {
            user_id: "hihihi",
            name: "Nugget",
            purchasedDate: new Date(),
            expiryDate: new Date(),
            quantity: 1,
            unit: "pc",
            category: "Frozen"
        }
    ]

    // TODO : Call API to get a list of all grocery items of the house / user ?

    const handleOpenCreateItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setCreateItemDialogOpen(true);
    };

    return (
        <div>
            Grocery List
            {groceryItems.map(
                item => <GroceryItemCard item={item} />
            )}
            <>
                <IconButton onClick={handleOpenCreateItem} color='inherit'>
                    <AddCircleIcon />
                </IconButton>
            </>

            <CreateGroceryItemDialog
                dialogOpen={createItemDialogOpen}
                setDialogOpen={setCreateItemDialogOpen}
            />
        </div>
    );
}

export default GroceryListPage;
