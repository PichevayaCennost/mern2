import PostModel from '../models/Post.js'

export const create = async (req, res) => {
    try {
        const { title, text, tags, imageUrl } = req.body;

        const doc = new PostModel({
            title,
            text,
            tags,
            imageUrl,
            user: req.userId
        })

        const post = await doc.save();

        res.json({
            success: true,
            post,
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Не удалось запостить"
        })
    }
}