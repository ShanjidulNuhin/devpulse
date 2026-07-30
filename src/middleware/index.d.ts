
// import { UserModel } from "../../src/user/user.model";
import { jwtPayload } from "jsonwebtoken";

declare global{
    namespace Express {
        interface Request {
            user?: jwtPayload;
        }
    }
}