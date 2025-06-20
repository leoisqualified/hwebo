// routes/admin.ts
import { Router } from "express";
import {
  getPendingSuppliers,
  getSupplierProfile,
  verifySupplier,
  rejectSupplier,
} from "../controllers/adminController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.use(authenticate);
router.use(authorize(["admin"]));

router.get("/pending-suppliers", getPendingSuppliers);
router.get("/supplier/:id", getSupplierProfile);
router.patch("/supplier/:id/verify", verifySupplier);
router.patch("/supplier/:id/reject", rejectSupplier);

export default router;
