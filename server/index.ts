const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(compression());

// Statik derleme dosyaları
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// İletişim formu API rotası
app.post('/api/send-email', (req, res) => {
    const { name, company, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.FOLIO_EMAIL,
            pass: process.env.FOLIO_PASSWORD,
        },
    });

    transporter
        .verify()
        .then(() => {
            transporter
                .sendMail({
                    from: `"${name}" <${process.env.FOLIO_EMAIL}>`,
                    to: process.env.TARGET_EMAIL || process.env.FOLIO_EMAIL,
                    replyTo: email,
                    subject: `${name} <${email}> ${
                        company ? `from ${company}` : ''
                    } - Portfolio Contact Form`,
                    text: `${message}`,
                })
                .then((info) => {
                    console.log({ info });
                    res.json({ message: 'success' });
                })
                .catch((e) => {
                    console.error(e);
                    res.status(500).send(e);
                });
        })
        .catch((e) => {
            console.error(e);
            res.status(500).send(e);
        });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});