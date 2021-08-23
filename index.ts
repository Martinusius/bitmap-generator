// @ts-ignore
import BMP from 'binary-bmp';

import nodeCanvas from 'canvas';
import axios from 'axios';
import express from 'express';

const { createCanvas } = nodeCanvas; 


// --------------------------
// Express stuff
// --------------------------

const port = 5000;
const app = express();

app.use(express.json());

app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', async (request, response) => {
    try {
        const gatewayRange = Number(request.query.gatewayRange) || 300;
        const buffer = await createBitmap(gatewayRange);

        response.status(200);
        response.write(buffer, 'binary');
        response.end(null, 'binary');
    }
    catch(err) {
        console.log(`Error during GET request: ${err}`);
        response.status(500)
            .send('Internal Server Error');
    }
});

app.post('/', async (request, response) => {
    try {
        const gatewayRange = Number(request.body.gatewayRange) || 300;
        const buffer = await createBitmap(gatewayRange);

        response.status(200);
        response.write(buffer, 'binary');
        response.end(null, 'binary');
    }
    catch(err) {
        console.log(`Error during POST request: ${err}`);
        response.status(500)
            .send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log('Server started');
});




// --------------------------
// Bitmap stuff
// --------------------------

interface Gateway {
    location: {
        latitude: number,
        longitude: number,
    }
}

type GatewayData = Record<string, Gateway>;

async function createBitmap(gatewayRange: number) {
    // Gateway data
    const data: GatewayData = (await axios.get('https://www.thethingsnetwork.org/gateway-data/')).data;

    // Draw circles onto canvas
    const width = 360, height = 180;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    Object.values(data).forEach(gateway => {
        if(!gateway.location) return;

        context.beginPath();
        context.arc(
            Math.floor(gateway.location.longitude + 180) / 360 * width, // x
            height - Math.floor(gateway.location.latitude + 90) / 180 * height, // y
            gatewayRange / 111 / Math.cos(gateway.location.latitude * Math.PI / 180), // radius
            0, 2 * Math.PI // full circle
        );
        context.fill();
    });

    // Convert into bitmap
    const imageData = context.getImageData(0, 0, width, height);
    const buffer = new Array(width * height);
    for(let i = 0; i < width * height; ++i) {
        buffer[i] = imageData.data[i * 4] / 255;
    }

    // Convert to file

    // @ts-ignore
    const bitmap = new BMP(1, { width, height, data: buffer });
    // @ts-ignore
    return bitmap.getBuffer();
}