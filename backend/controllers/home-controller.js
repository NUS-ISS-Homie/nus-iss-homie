import mongoose from 'mongoose';
import {
    ormCreateHome as _createHome,
    ormGetHome as _getHome,
    ormJoinHome as _joinHome,
    ormLeaveHome as _leaveHome,
    ormDeleteHome as _deleteHome,
} from '../model/home/home-orm.js';

export async function createHome(req, res) {
    try {
        const { adminUser } = req.body;
        if (adminUser) {
            const home = await _createHome(adminUser);
            if (!home || home.error) {
                console.log(res);
                return res.status(500).json({ message: res.message });
            }

            return res.status(201).json({ home, message: 'Successfully created home!' });
        }

        return res.status(400).json({ message: 'Incorrect request parameters!' });
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

export async function joinHome(req, res) {
    try {
        const { homeId, userId } = req.body;

        if (!homeId) {
            return res.status(400).json({ message: 'Missing home ID' });
        }
        
        if (!userId) {
            return res.status(400).json({ message: 'Missing user ID' });
        }
        
        const home = await _joinHome(homeId, userId);
        if (!home || home.error) {
            console.log(home);
            return res.status(400).json({ message: 'Could not join home!' });
        }

        return res.status(200).json({home, message: 'Successfully joined home!'});
    } catch (err) {
        console.log('Error home: ' + err);
        return res.status(500).json({ message: err });
    }
}

export async function leaveHome(req, res) {
    try {
        const { homeId, userId } = req.body;

        if (!homeId) {
            return res.status(400).json({ message: 'Missing home ID' });
        }
        
        if (!userId) {
            return res.status(400).json({ message: 'Missing user ID' });
        }
        
        const home = await _leaveHome(homeId, userId);
        if (!home || home.err) {
            return res.status(400).json({ message: 'Could not leave home!' });
        }

        return res.status(200).json({home, message: 'Successfully left home!'});
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

        return res.status(200).json({home, message: 'Successfully deleted home!'});
    } catch (err) {
        console.log('Error home: ' + err);
        return res.status(500).json({ message: err });
    }
}

