const express = require('express');
const router = express.Router();

// Route to get application information
router.get('/info', (req, res) => {
    const appInfo = {
        name: 'My Application',
        version: '1.0.0',
        description: 'This is a sample application.'
    };
    res.json(appInfo);
});

// Route to get server status
router.get('/status', (req, res) => {
    const status = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };
    res.json(status);
});

// 
module.exports = router;