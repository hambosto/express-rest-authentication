import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    }
});

export const UserModel = mongoose.model("User", UserSchema);

export const getAllUsers = async () => {
    try {
        return await UserModel.find();
    } catch (error) {
        throw new Error(`Error getting users: ${error}`);
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        return await UserModel.findOne({ email });
    } catch (error) {
        throw new Error(`Error getting user by email: ${error}`);
    }
};

export const getUserBySessionToken = async (sessionToken: string) => {
    try {
        return await UserModel.findOne({ 'authentication.sessionToken': sessionToken });
    } catch (error) {
        throw new Error(`Error getting user by session token: ${error}`);
    }
};

export const getUserById = async (id: string) => {
    try {
        return await UserModel.findById(id);
    } catch (error) {
        throw new Error(`Error getting user by ID: ${error}`);
    }
};

export const createUser = async (values: Record<string, any>) => {
    try {
        const user = await UserModel.create(values);
        return user.toObject();
    } catch (error) {
        throw new Error(`Error creating user: ${error}`);
    }
};

export const deleteUserById = async (id: string) => {
    try {
        return await UserModel.findOneAndDelete({ _id: id });
    } catch (error) {
        throw new Error(`Error deleting user by ID: ${error}`);
    }
};

export const updateUserById = async (id: string, values: Record<string, any>) => {
    try {
        return await UserModel.findByIdAndUpdate(id, values);
    } catch (error) {
        throw new Error(`Error updating user by ID: ${error}`);
    }
};
