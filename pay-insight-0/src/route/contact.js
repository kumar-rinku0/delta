import { Router } from "express";
import wrapAsync from "../util/wrap-async.js";
import {
    handleCreateContact
} from "../controller/contact.js";

const router = Router();

router.post('/create', wrapAsync(handleCreateContact));

export default router;
