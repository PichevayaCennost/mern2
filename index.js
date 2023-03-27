import express from "express";
import mongoose from "mongoose";

import { registerValidator, loginValidator, postValidator } from "./validation.js"
import UserModel from "./models/User.js";
import checkAuth from './utils/checkAuth.js'
import { getMe, login, register } from "./controllers/UserController.js";
import { create } from "./controllers/PostController.js";

const app = express();
app.use(express.json()); // Для того, чтобы можно было рабоать с json объектами

try {
	mongoose.connect(
		"mongodb+srv://admin:admin@cluster0.jd63kvs.mongodb.net/mern-archakov?retryWrites=true&w=majority"
	);
	console.log("DataBase OK");
} catch (error) {
	console.log(error);
}

app.post("/auth/register", registerValidator, register);

app.post("/auth/login", loginValidator, login);

app.get("/auth/me", checkAuth, getMe);

app.post("/post/create", checkAuth, postValidator, create)


app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	} else console.log("Server OK");
});

















app.post("/admin/accounts", async (_, res) => {
	try {
		await UserModel.deleteMany();
		res.json({
			success: true,
		})
	} catch (error) {
		console.log(error)
		res.json({
			success: false,
		})
	}
})