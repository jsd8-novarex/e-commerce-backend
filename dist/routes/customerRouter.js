"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomers = getCustomers;
const express_1 = __importDefault(require("express"));
const customerRouter = express_1.default.Router();
customerRouter.get('/', getCustomers);
async function getCustomers(req, res, next) {
    try {
        res.status(200).send({
            message: 'test getCustomers',
        });
    }
    catch (error) {
        res.status(400).send({ status: 'failure', message: error.message });
    }
}
exports.default = customerRouter;
