import {
  createHomeModel,
  getHomeModel,
  updateOperation,
  updateHomeModel,
  deleteHomeModel,
  getHomeModelByUserId,
} from './home-repository.js';

export async function ormCreateHome(adminUser) {
  try {
    const newHome = await createHomeModel({
      adminUser: adminUser,
      users: [],
    });
    await newHome.save();
    return newHome;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormGetHome(homeId) {
  try {
    const home = await getHomeModel(homeId);
    return home;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormGetHomeByUserId(userId) {
  try {
    const home = await getHomeModelByUserId(userId);
    return home;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormJoinHome(homeId, userId) {
  try {
    const updatedHome = await updateHomeModel({
      homeId,
      userId,
      operation: updateOperation.Join,
    });
    return updatedHome;
  } catch (err) {
    return { error: true, message: err };
  }
}

export async function ormLeaveHome(homeId, userId) {
  try {
    const updatedHome = await updateHomeModel({
      homeId,
      userId,
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
