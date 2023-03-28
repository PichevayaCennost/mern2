import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    const token = (req.headers.authorization?.substring(7))
    
    if (token) {
        try {
            const decoded = jwt.verify(token, 'bulat');

            req.userId = decoded._id;

            next();

        } catch (error) {
            console.log(error)
            return res.status.json({
                success: false,
                message: "Нет доступа"
            })
        }

    } else {
        return res.status(403).json({
            message: "Нет доступа"
        })
    }
}