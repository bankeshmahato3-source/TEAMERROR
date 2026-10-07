"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Restricted to ADMIN & SECURITY_ANALYST
router.use(auth_1.authenticateJwt);
router.use((0, auth_1.requireRoles)(['ADMIN', 'SECURITY_ANALYST']));
router.get('/users', adminController_1.getAdminUsers);
router.get('/merchants', adminController_1.getAdminMerchants);
router.patch('/merchants/:id/status', (0, auth_1.requireRoles)(['ADMIN']), adminController_1.toggleMerchantStatus);
router.get('/fraud-rules', adminController_1.getFraudRules);
router.patch('/fraud-rules/:id', (0, auth_1.requireRoles)(['ADMIN']), adminController_1.updateFraudRule);
router.patch('/thresholds', (0, auth_1.requireRoles)(['ADMIN']), adminController_1.updateThresholds);
router.get('/logs', adminController_1.getSecurityLogs);
exports.default = router;
