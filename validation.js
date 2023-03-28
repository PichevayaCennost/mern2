import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("fullName").isLength({ min: 3 }),
  body("avatarUrl").optional().isURL(),
];

export const loginValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

export const postValidator = [
  body("title").isLength({ min: 3 }), 
  body("text").isLength({ min: 3 }),
  body("tags").optional().isString(),
  body("imageUrl").optional().isString(),
];
