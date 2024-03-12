import {
    ormCreateGroceryItem as _createGroceryItem,
    ormGetGroceryItem as _getGroceryItem,
    ormUpdateGroceryItem as _updateGroceryItem,
    ormDeleteGroceryItem as _deleteGroceryItem
} from '../models/grocery-item/grocery-item-orm.js';
import * as constants from '../common/messages.js';

export const entity = 'grocery item';

function isDuplicateError(err) {
    const duplicateError = { name: 'MongoServerError', code: 11000 };
    return err.name === duplicateError.name && err.code === duplicateError.code;
}

function isCompleteField(body) {
    const { user_id, name, purchasedDate, expiryDate, quantity, unit, category } = req.body;
    return user_id, name && purchasedDate && expiryDate && quantity && unit && category;
}

export async function createGroceryItem(req, res) {
    try {
        const { user_id, name, purchasedDate, expiryDate, quantity, unit, category } = req.body;

        if (isCompleteField(req.body)) {
            const resp = await _createGroceryItem(user_id, name, purchasedDate, expiryDate, quantity, unit, category);
            if (resp.err) {
                if (isDuplicateError(resp.err)) {
                    return res
                        .status(constants.STATUS_CODE_DUPLICATE)
                        .json({ message: constants.FAIL_DUPLICATE(entity, username) });
                }
                return res
                    .status(constants.STATUS_CODE_BAD_REQUEST)
                    .json({ message: 'Could not create a new grocery item!' });
            } else {
                return res
                    .status(constants.STATUS_CODE_CREATED)
                    .json({ message: constants.SUCCESS_CREATE(entity, username) });
            }
        } else {
            return res
                .status(constants.STATUS_CODE_BAD_REQUEST)
                .json({ message: constants.FAIL_MISSING_FIELDS });
        }
    } catch (err) {
        return res
            .status(constants.STATUS_CODE_SERVER_ERROR)
            .json({ message: constants.FAIL_DATABASE_ERROR });
    }
}

export async function getGroceryItem(req, res) {
    try {
        const { groceryItemId } = req.params;
        if (groceryItemId) {
            const item = await _getGroceryItem(groceryItemId);
            if (!item) {
                return res
                    .status(constants.STATUS_CODE_NOT_FOUND)
                    .json({ message: constants.FAIL_NOT_EXIST(entity) });
            }

            if (user.err) {
                return res
                    .status(constants.STATUS_CODE_BAD_REQUEST)
                    .json({ message: 'Could not get the item!' });
            }

        } else {
            return res
                .status(constants.STATUS_CODE_BAD_REQUEST)
                .json({ message: constants.FAIL_MISSING_FIELDS });
        }
    } catch (err) {
        console.log(err);
        return res.status(constants.STATUS_CODE_SERVER_ERROR).json(err);
    }
}

export async function updatedGroceryItem(req, res) {
    try {
        const { groceryItemId } = req.params;
        const { user_id, name, purchasedDate, expiryDate, quantity, unit, category } = req.body;
        if (groceryItemId) {
            const item = await _getGroceryItem(groceryItemId);

            if (!item) {
                return res
                    .status(constants.STATUS_CODE_BAD_REQUEST)
                    .json({ message: constants.FAIL_INCORRECT_FIELDS });
            }

            const updated = await _updateGroceryItem(
                groceryItemId, user_id,
                name, purchasedDate, expiryDate, quantity, unit, category
            );

            if (!updated || updated.err) {
                return res
                    .status(constants.STATUS_CODE_BAD_REQUEST)
                    .json({ message: constants.FAIL_INCORRECT_FIELDS });
            }

            return res
                .status(constants.STATUS_CODE_OK)
                .json({ message: constants.SUCCESS_UPDATE(entity, '') });
        }
        return res
            .status(constants.STATUS_CODE_BAD_REQUEST)
            .json({ message: constants.FAIL_MISSING_FIELDS });
    } catch (err) {
        return res
            .status(constants.STATUS_CODE_SERVER_ERROR)
            .json({ message: constants.FAIL_DATABASE_ERROR });
    }
}

export async function deleteGroceryItem(req, res) {
    try {
        const { groceryItemId } = req.params;
        if (groceryItemId) {
            const isDeleted = await _deleteGroceryItem(groceryItemId);
            if (!isDeleted || isDeleted.err) {
                return res
                    .status(constants.STATUS_CODE_NOT_FOUND)
                    .json({ message: constants.FAIL_NOT_EXIST(entity) });
            }
            return res
                .status(constants.STATUS_CODE_OK)
                .json({ message: constants.SUCCESS_DELETE(entity, name) });
        } else {
            return res
                .status(constants.STATUS_CODE_BAD_REQUEST)
                .json({ message: constants.FAIL_MISSING_FIELDS });
        }
    } catch (err) {
        return res
            .status(constants.STATUS_CODE_SERVER_ERROR)
            .json({ message: constants.FAIL_DATABASE_ERROR });
    }
}