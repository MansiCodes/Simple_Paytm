const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({ balance: account.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const { amount, to } = req.body;

    try {
        const senderAccount = await Account.findOne({ userId: req.userId });

        if (!senderAccount || senderAccount.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const recipientAccount = await Account.findOne({ userId: to });

        if (!recipientAccount) {
            return res.status(400).json({ message: "Invalid recipient account" });
        }

        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        );
        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        );

        res.json({ message: "Transfer successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
 
module.exports = router;
