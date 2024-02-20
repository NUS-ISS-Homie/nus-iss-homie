import Chore from '../model/Chore.js';

const choreController = {
  createChore: async (req, res) => {
    try {
      const chore = new Chore(req.body);
      await chore.save();
      res.status(201).json(chore);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllChores: async (req, res) => {
    try {
      const chores = await Chore.find();
      res.status(200).json(chores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getChoreById: async (req, res) => {
    try {
      const chore = await Chore.findById(req.params.id);
      res.status(200).json(chore);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateChore: async (req, res) => {
    try {
      const chore = await Chore.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(chore);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteChore: async (req, res) => {
    try {
      await Chore.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default choreController;
