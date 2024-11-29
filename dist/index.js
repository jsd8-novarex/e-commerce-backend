"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const indexRouter_1 = __importDefault(require("./routes/indexRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express_1.default.json());
// app.use(express.static('public'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', indexRouter_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
