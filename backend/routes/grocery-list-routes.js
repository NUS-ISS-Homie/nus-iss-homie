import express from 'express';
import { 
    addToList, 
    createGroceryList, 
    deleteFromList, 
    deleteList, 
    getGroceryList 
} from '../controllers/grocery-list-controller.js';
const router = express.Router();

// Controller will contain all user-defined routes
router.post('/', createGroceryList);
router.put('/', getGroceryList);
router.delete('/', deleteList);
router.put('/:homeId/remove', deleteFromList);

router.get('/:homeId', getGroceryList);
router.put('/:homeId/add', addToList);

export default router;
