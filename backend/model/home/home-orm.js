import {
    createHomeModel,
    getHomeModel,
    updateHomeModel,
    deleteHomeModel
} from "./home-repository.js";

export async function ormCreateHome(adminUser) {
    try {
        const newHome = await createHomeModel({ users: adminUser });
        await newHome.save();

        return {
            error: false,
            message: "Room creation successful!",
            roomId: newHome._id,
        };
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

export async function ormUpdateHome(homeId) {
    try {
        const updatedHome = await updateHomeModel({ homeId });
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
            message: "Room deletion successful!",
        };
    } catch (err) {
        return { error: true, message: err };
    }
}