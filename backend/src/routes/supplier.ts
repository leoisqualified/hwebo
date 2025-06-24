// routes/supplier.ts
import { Router } from "express";
import { submitSupplierProfile } from "../controllers/supplierController";
import { upload } from "../middlewares/upload";
import { authenticate } from "../middlewares/authenticate";
import { validateRequest } from "../middlewares/validateRequest";
import { supplierProfileSchema } from "../validations/supplierProfile";

const router = Router();

router.post(
  "/kyc",
  authenticate,
  upload.fields([
    { name: "fdaLicense", maxCount: 1 },
    { name: "registrationCertificate", maxCount: 1 },
    { name: "ownerId", maxCount: 1 },
  ]),
  validateRequest(supplierProfileSchema),
  submitSupplierProfile
);

export default router;
