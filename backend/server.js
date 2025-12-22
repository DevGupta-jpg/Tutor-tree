// --- Purana Code ---
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// --- NAYA CODE SHURU ---

// 1. Nodemailer ko import karein
 

// 2. Form se JSON data padhne ke liye (yeh zaroori hai)
// Inhein app.use(cors()) se pehle rakhein
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- NAYA CODE KHATAM ---

app.use(cors());

// Request logging middleware (for debugging)
app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && req.path !== '/') {
        console.log(`📥 Request: ${req.method} ${req.path}`);
    }
    next();
});

// Aapka purana test API route (ise rehne dein)
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the backend! 👋' });
});


// --- FORM SUBMIT KE LIYE NAYA API ROUTE (UPDATED) ---
app.post('/api/send-enquiry', (req, res) => {
    
    console.log("✅ POST /api/send-enquiry route hit hua!");
    console.log("Form data receive hua:", req.body); // Check karne ke liye

    // 1. Frontend se saara naya data nikaalein
    const { name, email, phone, studentClass, subject, message } = req.body;
    
    // Validation check
    if (!name || !email || !phone) {
        return res.status(400).json({ 
            success: false, 
            message: 'Name, email, aur phone number zaroori hai.' 
        });
    }

    // 2. Transporter (Yeh wahi rahega)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vdev42547@gmail.com',  
            pass: 'vouv pnti vciu ukeh' // ⚠️ Apna App Password Yahan Daalein
        }
    });

    // 3. Mail Options (Ise update kiya gaya hai)
    const mailOptions = {
        from: `"${name}" <${email}>`, 
        to: 'vdev42547@gmail.com',     
        subject: `Nayi Enquiry Aayi Hai (${subject} - ${studentClass} Class) - ${name}`,
        html: `
            <h3 style="color: #333;">Website se ek nayi enquiry aayi hai:</h3>
            <hr>
            <p><strong>Naam:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phone}</p>
            <p><strong>Class:</strong> ${studentClass}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    // 4. Email bhejein (Yeh wahi rahega)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email bhejte waqt error:', error);
            res.status(500).json({ success: false, message: 'Email nahi bhej paaye.' });
        } else {
            console.log('Email Bhej diya gaya: ' + info.response);
            res.status(200).json({ success: true, message: 'Message bhej diya gaya hai!' });
        }
    });
});
// --- NAYA API ROUTE YAHAN KHATAM ---

// Serve images from image folder
app.use('/image', express.static(path.join(__dirname, '../image')));

// Serve static files from frontend folder (CSS, JS, etc.) - MUST be before root route
const frontendPath = path.join(__dirname, '../frontend');
console.log('📁 Serving static files from:', frontendPath);
app.use(express.static(frontendPath));

// Explicitly serve index.html for root route (after static files middleware)
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '../frontend/index.html');
    console.log('📄 Serving index.html from:', indexPath);
    res.sendFile(indexPath);
});

// 404 handler for API routes - MUST be after static files but before listen
// This will catch any API routes that don't match
app.use('/api/*', (req, res, next) => {
    console.log(`❌ API route not found: ${req.method} ${req.path}`);
    res.status(404).json({ success: false, message: `API route not found: ${req.method} ${req.path}` });
});

app.listen(port, () => {
  console.log(`\n✅ Backend server http://localhost:${port} par chal raha hai\n`);
  console.log(`📋 Registered API routes:`);
  console.log(`  ✅ GET  /api/message`);
  console.log(`  ✅ POST /api/send-enquiry\n`);
  console.log(`⚠️  Agar route kaam nahi kar raha, to server ko restart karein!\n`);
});