const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const si = require('systeminformation');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Broadcast hardware data every 2 seconds
setInterval(async () => {
    try {
        const temp = await si.cpuTemperature();
        const load = await si.currentLoad();
        // Sending data to the website
        io.emit('stats', {
            temp: temp.main,
            cpu: load.currentLoad.toFixed(1)
        });
    } catch (e) { console.log(e) }
}, 2000);

server.listen(3000, () => console.log('Radar active at http://localhost:3000 🚀'));