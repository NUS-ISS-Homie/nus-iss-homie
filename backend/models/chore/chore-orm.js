import {
  createChore,
  getChore,
  getChoresByHomeId,
  getChoresByNotificationId,
  getChoresScheduledToday,
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
export async function ormGetChoresByHomeId(homeId) {
  try {
    const chores = await getChoresByHomeId(homeId);
    return chores;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

// READ FUNCTION
export async function ormGetChoresByNotificationId(notificationId) {
  try {
    const chores = await getChoresByNotificationId(notificationId);
    return chores;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

// READ FUNCTION
export async function ormGetChoresScheduledToday() {
  try {
    const chores = await getChoresScheduledToday();
    return chores;
  } catch (err) {
    console.error('Error retrieving chores:', err);
    return { error: 'Failed to retrieve chores' };
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

export async function ormGetAllChoresDueToday() {
  try {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const choresDueToday = await ChoreModel.find({
      dueDate: {
        $gte: startOfToday,
        $lt: endOfToday,
      },
    });

    return choresDueToday;
  } catch (err) {
    console.error(err);
    console.error('ERROR: Could not get chores due today from DB.');
    return { error: err };
  }
}
