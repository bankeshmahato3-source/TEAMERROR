"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentsController_1 = require("../controllers/paymentsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Sandbox checkout process can be executed by customer
router.post('/', paymentsController_1.processPayment);
router.get('/', auth_1.authenticateJwt, paymentsController_1.getPayments);
router.get('/:id', auth_1.authenticateJwt, paymentsController_1.getPaymentById);
router.post('/:id/refund', auth_1.authenticateJwt, paymentsController_1.refundPayment);
exports.default = router;
