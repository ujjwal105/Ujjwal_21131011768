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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const PORT = 9876;
const WINDOW_SIZE = 10;
let numberWindow = [];
// Test Server URLs
const URLS = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/random'
};
const fetchNumbers = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(url, { timeout: 500 });
        return response.data.numbers;
    }
    catch (error) {
        return [];
    }
});
app.get('/numbers/:numberid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const numberid = req.params.numberid;
    if (!URLS[numberid]) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }
    const prevState = [...numberWindow];
    const numbers = yield fetchNumbers(URLS[numberid]);
    numbers.forEach(num => {
        if (!numberWindow.includes(num)) {
            if (numberWindow.length >= WINDOW_SIZE) {
                numberWindow.shift();
            }
            numberWindow.push(num);
        }
    });
    const currState = [...numberWindow];
    const avg = numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length;
    res.json({
        "windowPrevState": prevState,
        "windowCurrState": currState,
        "numbers": numbers,
        "avg": parseFloat(avg.toFixed(2))
    });
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
