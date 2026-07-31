import { Router } from "express";
import { authController } from "./auth.controller"
import auth from "../../middleware/auth";
const router = Router();

router.post("/signup", authController.userRegistration);
router.post("/login", authController.userLogin);
// router.get("/user/:id", auth);
router.get("/:id", authController.getUser);
router.put("/:id", authController.updateUser);
router.delete("/:id", authController.deleteUser);

export const authRoute = router;