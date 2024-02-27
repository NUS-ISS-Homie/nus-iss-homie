import {
  createHomeModel,
  getHomeModel,
  updateOperation,
  updateHomeModel,
  deleteHomeModel,
} from './home-repository.js';

export async function ormCreateHome(adminUser) {
  try {
    const newHome = await createHomeModel({ users: [adminUser] });
    await newHome.save();
    return newHome;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormGetHome(homeId) {
  try {
    const newHome = await getHomeModel(homeId);
    return newHome;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormJoinHome(homeId, username) {
  try {
    const updatedHome = await updateHomeModel({
      homeId,
      username,
      operation: updateOperation.Join,
    });
    return updatedHome;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormLeaveHome(homeId, username) {
  try {
    const updatedHome = await updateHomeModel({
      homeId,
      username,
      operation: updateOperation.Remove,
    });
    return updatedHome;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormDeleteHome(homeId) {
  try {
    await deleteHomeModel(homeId);
    return {
      error: false,
      message: 'Home deletion successful!',
    };
  } catch (err) {
    return { error: true, message: err };
  }
}
