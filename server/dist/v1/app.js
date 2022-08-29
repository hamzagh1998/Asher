"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(helmet_1.default.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        "img-src": ["'self'", "https: data:"]
    }
}));
process.env.NODE_ENV !== "production" && app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "..", "public")));
// app.use("/api/v1/auth", AuthRouter);
// app.use("/api/v1/users", UserRouter);
// custom middleware
// app.use(errorCatcher)
app.get("/*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "..", "public", "index.html"));
});
