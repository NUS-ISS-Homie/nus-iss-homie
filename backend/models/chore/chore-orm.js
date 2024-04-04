import {
  createChore,
  getChore,
  getAllChoresInHome,
  getAllChoresDueToday,
  updateChore,
  deleteChore,
} from './chore-repository.js';

// CREATE FUNCTION
export async function ormCreateChore(params) {
  try {
    const chore = await createChore(params);
    await chore.save();
    return chore;
  } catch (err) {
    return { err };
  }
}

// READ FUNCTION
export async function ormGetChore(choreId) {
  try {
    const chore = await getChore(choreId);
    return chore;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

// READ FUNCTION
export async function ormGetAllChoresInHome(params) {
  try {
    const chores = await getAllChoresInHome(params);
    return chores;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

// READ FUNCTION
export async function ormGetAllChoresDueToday() {
  try {
    const chores = await getAllChoresDueToday();
    return chores;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

// UPDATE FUNCTION
export async function ormUpdateChore(choreId, updatedFields) {
  try {
    const updatedChore = await updateChore(choreId, updatedFields);
    return updatedChore;
  } catch (err) {
    return { err };
  }
}

// DELETE FUNCTION
export async function ormDeleteChore(choreId) {
  try {
    const deletedChore = await deleteChore(choreId);
    return deletedChore;
  } catch (err) {
    return { err };
  }
}
