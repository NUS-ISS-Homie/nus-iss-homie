import express from 'express';
import {
    createGroceryItem,
    getGroceryItem,
    updatedGroceryItem,
    deleteGroceryItem
} from '../controllers/grocery-item-controller.js'

const router = express.Router();

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from grocery item CRUD'));

router.post('/:itemId', createGroceryItem);
router.get('/:itemId', getGroceryItem);
router.put('/:itemId', updatedGroceryItem);
router.delete('/:itemId', deleteGroceryItem);

export default router;
