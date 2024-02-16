import {
    ormCreateHome as _createHome,
    ormGetHome as _getHome,
    ormUpdateHome as _updateHome,
    ormDeleteHome as _deleteHome,
} from '../model/home/home-orm.js';

export async function createHome(req, res) {
    try {
        const { adminUser } = req.body;

        if (adminUser) {
            _createHome({ adminUser }).then((res) => {
                if (res.error) {
                    return res.status(500).json({ message: res.message });
                }

                return res.status(201).json({ homeId: res.homeId });
            });
        }

        res.status(400).json({ message: 'Incorrect request parameters!' });
    } catch (err) {
        return res
            .status(500)
            .json({ message: 'Database failure when creating new home!' });
    }
}

export async function getHome(req, res) {
    try {
        const { homeId } = req.query;

        if (!homeId) {
            return res.status(400).json({ message: 'Missing home ID' });
        }
        const home = await _getHome(homeId);
        if (!home) {
            return res.status(400).json({ message: 'Could not get home!' });
        }
        return res.status(201).json(home);
    } catch (err) {
        console.log('Error home: ' + err);
        return res.status(500).json({ message: err });
    }
}

export async function updateHome(req, res) {
    try {
        const { homeId } = req.body;

        if (!(homeId)) {
            return res.status(400).json({ message: 'Missing home ID' });
        }
        const home = await _updateHome(homeId);
        if (!home || home.err) {
            return res.status(400).json({ message: 'Could not update home!' });
        }

        return res.status(201).json(home);
    } catch (err) {
        console.log('Error home: ' + err);
        return res.status(500).json({ message: err });
    }
}

export async function deleteHome(req, res) {
    try {
        const { homeId } = req.body;

        if (!(homeId)) {
            return res.status(400).json({ message: 'Missing home ID' });
        }
        const home = await _deleteHome(homeId);
        if (!home || home.err) {
            return res.status(400).json({ message: 'Could not delete home!' });
        }

        return res.status(204).json(home);
    } catch (err) {
        console.log('Error home: ' + err);
        return res.status(500).json({ message: err });
    }
}

