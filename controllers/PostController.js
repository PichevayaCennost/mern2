import { validationResult } from "express-validator";

import PostModel from "../models/Post.js";

export const create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Ошибка при вводе данныхasdfasdfasd",
            });
        }

        const { title, text, tags, imageUrl } = req.body;

        const doc = new PostModel({
            title,
            text,
            tags,
            imageUrl,
            user: req.userId,
        });

        const post = await doc.save();

        res.json({
            success: "true",
            post,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Не удалось запостить",
        });
    }
};

export const getAll = async (_, res) => {
    try {
        const posts = await PostModel.find().populate("user").exec();

        res.json({
            success: true,
            posts,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: true,
            message: "Не удалось получить статьи",
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const { id } = req.params;

        PostModel.findByIdAndUpdate(
            { _id: id },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: "after",
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: "Не удалось получить пост"
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        success: false,
                        message: "Статья не найдена"
                    })
                }
                res.json({
                    success: true,
                    doc,
                });
            }
        );

    } catch (error) {
        console.log(error);
        res.json({
            success: true,
            message: "Не удалось получить пост",
        });
    }
};
