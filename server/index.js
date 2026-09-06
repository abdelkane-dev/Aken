// Aken — Backend API Server for CinetPay Integration
// Requires: npm install express cors dotenv cinetpay-js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// CinetPay configuration
const CINETPAY_CONFIG = {
  apiKey: process.env.CINETPAY_API_KEY,
  apiPassword: process.env.CINETPAY_API_PASSWORD,
  sandbox: process.env.NODE_ENV !== 'production'
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize payment
app.post('/api/cinetpay/pay', async (req, res) => {
  try {
    const { amount, currency = 'XOF', description = 'Acompte projet Aken' } = req.body;

    if (!amount || amount < 5000) {
      return res.status(400).json({ error: 'Le montant minimum est de 5 000 FCFA' });
    }

    // Generate unique transaction ID
    const merchantTransactionId = `AKEN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // In production, call CinetPay API:
    // const cinetpay = new CinetPayClient({ credentials: CINETPAY_CONFIG });
    // const payment = await cinetpay.initializePayment({
    //   amount,
    //   currency,
    //   description,
    //   merchantTransactionId,
    //   returnUrl: `${process.env.SITE_URL}/payment-success`,
    //   notifyUrl: `${process.env.API_URL}/api/cinetpay/webhook`
    // });

    // Simulated response for development
    res.json({
      success: true,
      paymentToken: `sim_${merchantTransactionId}`,
      paymentUrl: `https://checkout.cinetpay.com/simulated/${merchantTransactionId}`,
      merchantTransactionId,
      amount,
      currency
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'initialisation du paiement' });
  }
});

// Check payment status
app.get('/api/cinetpay/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;

    // In production, call CinetPay API:
    // const status = await cinetpay.getPaymentStatus({ merchantTransactionId: transactionId });

    // Simulated response
    res.json({
      code: 100,
      status: 'SUCCESS',
      merchant_transaction_id: transactionId,
      transaction_id: `txn_${Date.now()}`
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification du statut' });
  }
});

// Webhook endpoint for CinetPay notifications
app.post('/api/cinetpay/webhook', async (req, res) => {
  try {
    const { cpm_trans_status, cpm_trans_id, cpm_amount } = req.body;

    console.log('[CinetPay Webhook]', { status: cpm_trans_status, id: cpm_trans_id, amount: cpm_amount });

    // TODO: Verify payment, update database, send confirmation email/WhatsApp

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

app.listen(PORT, () => {
  console.log(`[Aken] API server running on port ${PORT}`);
});
