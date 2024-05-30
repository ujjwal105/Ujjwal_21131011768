import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
let numberWindow: number[] = [];

const URLS: { [key: string]: string } = {
    'p': 'http://20.244.56.144/test/primes',
    'f': 'http://20.244.56.144/test/fibo',
    'e': 'http://20.244.56.144/test/even',
    'r': 'http://20.244.56.144/test/random'
};

const fetchNumbers = async (url: string): Promise<number[]> => {
    try {
        const response = await axios.get(url, { timeout: 500 });
        console.log('API Response:', response.data);
        return response.data.numbers;
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
};


app.get('/numbers/:numberid', async (req: Request, res: Response) => {
    const numberid = req.params.numberid;
    if (!URLS[numberid]) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const prevState = [...numberWindow];

    const numbers = await fetchNumbers(URLS[numberid]);
    console.log('Fetched numbers:', numbers);

    numbers.forEach(num => {
        if (!numberWindow.includes(num)) {
            if (numberWindow.length >= WINDOW_SIZE) {
                numberWindow.shift();
            }
            numberWindow.push(num);
        }
    });

    const currState = [...numberWindow];
    console.log('Current state:', currState);

    const avg = numberWindow.length > 0 ? numberWindow.reduce((a, b) => a + b, 0) / numberWindow.length : null;
    console.log('Average:', avg);

    res.json({
        windowPrevState: prevState,
        windowCurrState: currState,
        numbers: numbers,
        avg: avg !== null ? parseFloat(avg.toFixed(2)) : null
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
