// server.js — simple signaling server
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));


let dashboardSocketId = null;
const phones = new Set();


io.on('connection', socket => {
    console.log('socket connected', socket.id);


    socket.on('identify', (role) => {
        console.log('identify', socket.id, role);
        socket.role = role;

        if (role === 'dashboard') {
            dashboardSocketId = socket.id;
            // Tell all already-connected phones to resend their offer
            for (const phoneId of phones) {
                io.to(phoneId).emit('request-offer');
            }
        }

        if (role === 'phone') {
            phones.add(socket.id);
            if (dashboardSocketId) {
                io.to(dashboardSocketId).emit('phone-joined', { phoneId: socket.id });
            }
        }
    });


    socket.on('offer', ({ targetId, sdp }) => {
        const dest = targetId || dashboardSocketId;
        if (dest) io.to(dest).emit('offer', { from: socket.id, sdp });
    });


    socket.on('answer', ({ targetId, sdp }) => {
        if (targetId) io.to(targetId).emit('answer', { from: socket.id, sdp });
    });


    socket.on('ice-candidate', ({ targetId, candidate }) => {
        const dest = targetId || dashboardSocketId;
        if (dest) io.to(dest).emit('ice-candidate', { from: socket.id, candidate });
    });


    socket.on('disconnect', () => {
        console.log('disconnect', socket.id);
        if (socket.id === dashboardSocketId) {
            dashboardSocketId = null;
        } else {
            phones.delete(socket.id);
            if (dashboardSocketId) io.to(dashboardSocketId).emit('phone-left', { phoneId: socket.id });
        }
    });
});


const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Signaling server running on port', PORT));