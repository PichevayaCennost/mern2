import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
	try {
		const { email, password, fullName, avatarUrl } = req.body;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				success: false,
				message: "Ошибка при вводе данных"
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hash = bcrypt.hashSync(password, salt);

		const doc = new UserModel({
			fullName,
			email,
			passwordHash: hash,
			avatarUrl,
		});

		const user = await doc.save();

		const { passwordHash, ...rest } = user._doc;

		const token = jwt.sign({
			_id: user._id,
		},
		'bulat', {
			expiresIn: '30d'
		})

		res.json({
			success: true,
			user: rest,
			token,
		});

	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Не удалось авторизоваться"
		});
	}
}

export const login = async (req, res) => { 
	try {
		const { email, password } = req.body;
		const user =  await UserModel.findOne({email:'bulat@mail.ru'})

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Такого пользователя не существует'
			})
		}
		
		const isValidPass = await bcrypt.compare(password, user._doc.passwordHash);
		if (!isValidPass) {
			return res.status(404).json({
				success: true,
				message: "Неверный логин или пароль",
			})
		}

		const token = jwt.sign({
			_id: user._id,
		},
		'bulat', {
			expiresIn: '30d'
		})

		const { passwordHash, ...rest } = user._doc;

		res.json({
			success: true, 
			rest,
			token
		})

	} catch (error) {
		console.log(error)
		res.json({
			success: false,
			message: "Не удалось залогиниться"
		})
	}
}

export const getMe =  async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Нет такого пользователя"
			})
		}

		const { passwordHash, ...rest } = user._doc;

		res.json({
			success: true,
			rest,
		})


	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false
		})
	}
}