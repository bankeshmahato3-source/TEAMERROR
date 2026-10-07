"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upiController_1 = require("../controllers/upiController");
const router = (0, express_1.Router)();
router.post('/check', upiController_1.checkUpiOrLink);
exports.default = router;
