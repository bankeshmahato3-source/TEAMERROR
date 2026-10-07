"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ordersController_1 = require("../controllers/ordersController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Order creation can be public or merchant authenticated
router.post('/', ordersController_1.createOrder);
router.get('/', auth_1.authenticateJwt, ordersController_1.getOrders);
router.get('/:orderId', ordersController_1.getOrderById);
exports.default = router;
