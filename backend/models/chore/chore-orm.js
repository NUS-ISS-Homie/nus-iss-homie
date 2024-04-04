import ChoreModel from './chore-model.js'; // Import Mongoose model for chore

// READ FUNCTION
export async function ormGetAllChores() {
  try {
    const chores = await ChoreModel.find(); // Fetch all chores from the database
    return chores;
  } catch (err) {
    console.error(err);
    console.error('ERROR: Could not get chores from DB.');
    return { error: err };
  }
}

// CREATE FUNCTION
export async function ormCreateChore(chore) {
  try {
    const { title, assignedTo, dueDate } = chore;

    console.log(
      'ormCreateChore',
      JSON.stringify({ title, assignedTo, dueDate })
    );
    const newChore = new ChoreModel({ title, assignedTo, dueDate });
    await newChore.save(); // Just call save() without passing parameters
    return true;
  } catch (err) {
    return { err };
  }
}

// READ FUNCTION
export async function ormGetChore(choreId) {
  try {
    console.log('choreId ' + choreId);
    const chore = await ChoreModel.findById(choreId);
    return chore;
  } catch (err) {
    console.log(err);
    console.log(`ERROR: Could not get chore from DB.`);
    return { err };
  }
}

// UPDATE FUNCTION
export async function ormUpdateChore(choreId, updatedFields) {
  try {
    const updatedChore = await ChoreModel.findByIdAndUpdate(
      choreId,
      updatedFields,
      { new: true }
    );
    return updatedChore;
  } catch (err) {
    return { err };
  }
}

// DELETE FUNCTION
export async function ormDeleteChore(choreId) {
  try {
    const deletedChore = await ChoreModel.findByIdAndDelete(choreId);
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
