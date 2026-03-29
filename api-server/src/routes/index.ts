import { Router, type IRouter } from "express";
import healthRouter from "./health";
import supportRouter from "./support";
import evaluationRouter from "./evaluation";

const router: IRouter = Router();

router.use(healthRouter);
router.use(supportRouter);
router.use(evaluationRouter);

export default router;
