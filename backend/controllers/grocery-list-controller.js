import {
    ormCreateGroceryList as _createList,
    ormGetGroceryList as _getList,
    ormGetGroceryListByHomeId as _getListByHomeId,
    ormAddToList as _addToList,
    ormDeleteFromList as _removeFromList,
    ormDeleteList as _deleteList
} from '../models/grocery-list/grocery-list-orm.js';
import * as msg from '../common/messages.js';

export const entity = 'Grocery List';

export async function createGroceryList(req, res) {
    try {
        const { homeId } = req.body;

        if (!homeId) {
            return res
                .status(msg.STATUS_CODE_BAD_REQUEST)
                .json({ message: msg.FAIL_MISSING_FIELDS });
        }

        const list = await _createList(homeId);
        if (!list || list.error) {
            console.log('ERROR!', list);
            return res
                .status(msg.STATUS_CODE_SERVER_ERROR)
                .json({ message: list.error.message });
        }

        return res
            .status(msg.STATUS_CODE_CREATED)
            .json({ list, message: msg.SUCCESS_CREATE(entity) });
    } catch (err) {
        return res
            .status(msg.STATUS_CODE_SERVER_ERROR)
            .json({ message: msg.FAIL_DATABASE_ERROR });
    }
}

export async function getGroceryList(req, res) {
    try {
        const { homeId } = req.params;
        const { listId } = req.body;

        if (!homeId && !listId) {
            return res
                .status(msg.STATUS_CODE_BAD_REQUEST)
                .json({ message: msg.FAIL_MISSING_FIELDS });
        }

        const resp = listId
            ? await _getList(listId)
            : await _getListByHomeId(homeId);

        if (!resp || resp.error) {
            console.log(resp);
            return res
                .status(msg.STATUS_CODE_NOT_FOUND)
                .json({ message: msg.FAIL_NOT_EXIST(entity) });
        }

        return res
            .status(msg.STATUS_CODE_OK)
            .json({ list: resp, message: msg.SUCCESS_READ(entity) });
    } catch (err) {
        return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
    }
}

export async function addToList(req, res) {
    try {
        const { homeId } = req.params;
        const { itemId } = req.body;

        if (!homeId || !itemId) {
            return res
                .status(msg.STATUS_CODE_BAD_REQUEST)
                .json({ message: msg.FAIL_MISSING_FIELDS });
        }

        const list = await _getListByHomeId(homeId);
        if (!list || list.error) {
            return res
                .status(msg.STATUS_CODE_NOT_FOUND)
                .json({ message: msg.FAIL_NOT_EXIST(entity) });
        }

        const resp = await _addToList(homeId, itemId);
        if (!resp || resp.error) {
            return res
                .status(msg.STATUS_CODE_BAD_REQUEST)
                .json({ message: msg.FAIL_MISSING_FIELDS });
        }

        return res
            .status(msg.STATUS_CODE_OK)
            .json({ list: resp, message: msg.SUCCESS_ACTION('Added to', entity) });
    } catch (err) {
        console.log('Error grocery list: ' + err);
        return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
    }
}

export async function deleteFromList(req, res) {
    try {
        const { homeId } = req.params;
        const { itemId } = req.body;

        if (!homeId || !itemId) {
            return res
                .status(msg.STATUS_CODE_BAD_REQUEST)
                .json({ message: msg.FAIL_MISSING_FIELDS });
        }

        const list = await _getListByHomeId(homeId);
        if (!list) {
            return res
                .status(msg.STATUS_CODE_BAD_REQUEST)
                .json({ message: msg.FAIL_NOT_EXIST(entity) });
        }

        const updatedList = await _removeFromList(homeId, itemId);
        if (!updatedList || updatedList.err) {
            return res
                .status(msg.STATUS_CODE_SERVER_ERROR)
                .json({ message: msg.FAIL_DATABASE_ERROR });
        }

        return res
            .status(msg.STATUS_CODE_OK)
            .json({ list: updatedList, message: msg.SUCCESS_ACTION('Removed from', entity) });
    } catch (err) {
        console.log('Error grocery list: ' + err);
        return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
    }
}

export async function deleteList(req, res) {
    try {
        const { homeId } = req.body;

        if (!homeId) {
            return res
                .status(msg.STATUS_CODE_BAD_REQUEST)
                .json({ message: msg.FAIL_MISSING_FIELDS });
        }

        // Check if home exists and if user is admin
        const list = await _getListByHomeId(homeId);
        if (!list) {
            return res
                .status(msg.STATUS_CODE_UNAUTHORIZED)
                .json({ message: msg.FAIL_UNAUTHORIZED });
        }

        const resp = await _deleteList(homeId);
        if (!resp || resp.err) {
            return res
                .status(msg.STATUS_CODE_SERVER_ERROR)
                .json({ message: msg.FAIL_DATABASE_ERROR });
        }

        return res
            .status(msg.STATUS_CODE_OK)
            .json({ list: resp, message: msg.SUCCESS_DELETE(entity) });
    } catch (err) {
        console.log('Error grocery list: ' + err);
        return res.status(msg.STATUS_CODE_SERVER_ERROR).json({ message: err });
    }
}
