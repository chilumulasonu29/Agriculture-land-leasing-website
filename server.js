const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config(); // Load .env file

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Serve static files (index.html, CSS, images)
app.use(express.static(path.join(__dirname)));

// Temporary in-memory storage (replace with DB later)
let users = [];
let leases = [];

// Registration route
app.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;
  users.push({ name, email, password, role });
  console.log('Registered:', users);
  res.redirect('/');
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).send('Invalid credentials');
  }

  console.log('Login success:', user);
  res.redirect('/');
});

// Booking route
app.post('/book', async (req, res) => {
  const { name, email, phone, duration, land } = req.body;
  leases.push({ name, email, phone, duration, land });
  console.log('Lease confirmed:', leases);

  try {
    // ✅ Nodemailer setup using .env
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS  // from .env
      }
    });

    // 1️⃣ Email to Landowner (your Gmail)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'sonuofficial2636@gmail.com', // landowner email
      subject: 'New Lease Booking',
      html: `
        <h2>New Lease Booking</h2>
        <p><strong>Land:</strong> ${land}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Duration:</strong> ${duration}</p>
      `
    });

    // 2️⃣ Styled Confirmation Email to Farmer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email, // farmer’s email from form
      subject: 'Lease Booking Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #4CAF50;">Lease Booking Confirmation</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for booking <strong>${land}</strong>.</p>
          <p><strong>Lease Duration:</strong> ${duration}</p>
          <p>We will contact you soon with further instructions.</p>
          <br>
          <p style="color: #555;">Regards,<br>Farmland Leasing</p>
        </div>
      `
    });

    res.status(200).send('Booking successful! Emails sent to landowner and farmer.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending booking email.');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
