"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var binary_bmp_1 = __importDefault(require("binary-bmp"));
var canvas_1 = __importDefault(require("canvas"));
var axios_1 = __importDefault(require("axios"));
var express_1 = __importDefault(require("express"));
var createCanvas = canvas_1.default.createCanvas;
// --------------------------
// Express stuff
// --------------------------
var port = 5000;
var app = express_1.default();
app.use(express_1.default.json());
app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var gatewayRange, buffer, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                gatewayRange = Number(request.query.gatewayRange) || 300;
                return [4 /*yield*/, createBitmap(gatewayRange)];
            case 1:
                buffer = _a.sent();
                response.status(200);
                response.write(buffer, 'binary');
                response.end(null, 'binary');
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log("Error during GET request: " + err_1);
                response.status(500)
                    .send('Internal Server Error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var gatewayRange, buffer, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                gatewayRange = Number(request.body.gatewayRange) || 300;
                return [4 /*yield*/, createBitmap(gatewayRange)];
            case 1:
                buffer = _a.sent();
                response.status(200);
                response.write(buffer, 'binary');
                response.end(null, 'binary');
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log("Error during POST request: " + err_2);
                response.status(500)
                    .send('Internal Server Error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log('Server started');
});
function createBitmap(gatewayRange) {
    return __awaiter(this, void 0, void 0, function () {
        var data, width, height, canvas, context, imageData, buffer, i, bitmap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.get('https://www.thethingsnetwork.org/gateway-data/')];
                case 1:
                    data = (_a.sent()).data;
                    width = 360, height = 180;
                    canvas = createCanvas(width, height);
                    context = canvas.getContext('2d');
                    context.fillStyle = '#ffffff';
                    Object.values(data).forEach(function (gateway) {
                        if (!gateway.location)
                            return;
                        context.beginPath();
                        context.arc(Math.floor(gateway.location.longitude + 180) / 360 * width, // x
                        height - Math.floor(gateway.location.latitude + 90) / 180 * height, // y
                        gatewayRange * 1000 / 111000 / Math.cos(gateway.location.latitude * Math.PI / 180), // radius
                        0, 2 * Math.PI // full circle
                        );
                        context.fill();
                    });
                    imageData = context.getImageData(0, 0, width, height);
                    buffer = new Array(width * height);
                    for (i = 0; i < width * height; ++i) {
                        buffer[i] = imageData.data[i * 4] / 255;
                    }
                    bitmap = new binary_bmp_1.default(1, { width: width, height: height, data: buffer });
                    // @ts-ignore
                    return [2 /*return*/, bitmap.getBuffer()];
            }
        });
    });
}
