const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');
const { AUTH_SERVICE_URL, ORDER_SERVICE_URL, CONTRACT_SERVICE_URL } = require('../config/ServerConfig');

// Cấu hình proxy cho Auth Service
router.use('/authService', createProxyMiddleware({
  target: AUTH_SERVICE_URL , // sử dụng biến từ config
  changeOrigin: true,
  pathRewrite: {
    '^/authService': '',
  },
  logLevel: 'debug', // ✅ log chi tiết request/response để debug nếu lỗi
  onError: (err, req, res) => {
    console.error('❌ Proxy error for Auth Service:', err.message);
    res.status(502).json({ error: 'Auth Service unavailable', detail: err.message });
  }
}));

// Cấu hình proxy cho Order Service
router.use('/orderService', createProxyMiddleware({
  target: ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/orderService': '', // Xóa tiền tố /orderService khi proxy
  },
  onError: (err, req, res) => {
    console.error('Proxy error for Order Service:', err);
    res.status(500).send('Proxy error for Order Service');
  },
}));

// Cấu hình proxy cho Contract Service
router.use('/contractService', createProxyMiddleware({
  target: CONTRACT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/contractService': '', // Xóa tiền tố /contractService khi proxy
  },
  onError: (err, req, res) => {
    console.error('Proxy error for Contract Service:', err);
    res.status(500).send('Proxy error for Contract Service');
  },
}));

module.exports = router;