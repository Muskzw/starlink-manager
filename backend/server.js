const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'starlink_super_secret_key_123';

app.use(cors());
app.use(express.json());

// Auth
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials. Hint: use alice@starops.com' });

    if (user.status !== 'Active') return res.status(403).json({ error: 'Account disabled' });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware to verify token
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protect the following routes
app.use('/api', requireAuth);

// Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Subscriptions
app.get('/api/subscriptions', async (req, res) => {
  try {
    const subs = await prisma.subscription.findMany({
      include: {
        card: true
      }
    });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subscriptions', async (req, res) => {
  try {
    const sub = await prisma.subscription.create({
      data: req.body
    });
    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Subscription
app.put('/api/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sub = await prisma.subscription.update({
      where: { id },
      data: req.body
    });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Subscription
app.delete('/api/subscriptions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Make sure we cascade or nullify. PaymentHistory relies on subscriptionId.
    // Let's delete related history first or delete everything using cascade if configured.
    // For safety here, delete related payment history first.
    await prisma.paymentHistory.deleteMany({ where: { subscriptionId: id } });
    await prisma.subscription.delete({ where: { id } });
    
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Payment Methods
app.get('/api/payment-methods', async (req, res) => {
  try {
    const methods = await prisma.paymentMethod.findMany();
    res.json(methods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/payment-methods', async (req, res) => {
  try {
    const method = await prisma.paymentMethod.create({
      data: req.body
    });
    res.status(201).json(method);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Payment Method
app.put('/api/payment-methods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const method = await prisma.paymentMethod.update({
      where: { id },
      data: req.body
    });
    res.json(method);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Payment Method
app.delete('/api/payment-methods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Unlink from subscriptions
    await prisma.subscription.updateMany({
      where: { cardId: id },
      data: { cardId: null, status: 'Suspended' }
    });
    // Unlink from payment history
    await prisma.paymentHistory.updateMany({
      where: { methodId: id },
      data: { methodId: null }
    });
    
    await prisma.paymentMethod.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Payment History
app.get('/api/payment-history', async (req, res) => {
  try {
    const history = await prisma.paymentHistory.findMany({
      include: {
        subscription: true,
        method: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard Stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const subs = await prisma.subscription.findMany();
    const methods = await prisma.paymentMethod.findMany();
    
    const totalCost = subs.reduce((acc, sub) => acc + sub.cost, 0);
    const totalBalance = methods.reduce((acc, m) => acc + m.balance, 0);
    const atRisk = subs.filter(s => s.status === 'Suspended' || s.cardId === null).length;
    const upcoming = subs.filter(s => s.status === 'Active').length; 

    res.json({
      totalCost,
      totalBalance,
      atRisk,
      upcoming
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
