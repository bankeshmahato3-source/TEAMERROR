"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/stats', auth_1.authenticateJwt, dashboardController_1.getDashboardStats);
router.get('/analytics', auth_1.authenticateJwt, dashboardController_1.getDashboardAnalytics);
exports.default = router;
