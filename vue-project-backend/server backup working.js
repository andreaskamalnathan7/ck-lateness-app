const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'school_attendance',
  waitForConnections: true,
  connectionLimit: 10
});

app.post('/api/register', async (req, res) => {
  const { student_id, email, password, name, ship, level, grade, class_group } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO students (student_id, email, password, name, ship, level, grade, class) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.execute(sql, [student_id, email, hashedPassword, name, ship, level, grade, class_group], (err) => {
    if (err) return res.status(500).json({ error: "Registration failed" });
    res.json({ message: "Student account created!" });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM students WHERE email = ? LIMIT 1`;

  db.execute(sql, [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: "User not found" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      delete user.password; 
      res.json({ message: "Login successful", user });
    } else {
      res.status(401).json({ error: "Wrong password" });
    }
  });
});

app.post('/api/scan', (req, res) => {
  const { student_id, reason, minutes_late } = req.body;
  const sql = `INSERT INTO lateness_records (student_id, reason, minutes_late) VALUES (?, ?, ?)`;
  
  db.execute(sql, [student_id, reason, minutes_late], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Attendance recorded!" });
  });
});

app.get('/api/history/:student_id', (req, res) => {
  const sql = `SELECT * FROM lateness_records WHERE student_id = ? ORDER BY arrival_time DESC`;
  db.execute(sql, [req.params.student_id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get('/api/admin/records', (req, res) => {
  const sql = `
    SELECT 
      s.student_id, 
      s.name, 
      s.level, 
      s.grade, 
      s.class as class_group, 
      s.ship, 
      l.arrival_time as date, 
      l.minutes_late as total_lateness,
      l.reason
    FROM lateness_records l
    JOIN students s ON l.student_id = s.student_id
    ORDER BY l.arrival_time DESC
  `;

  db.execute(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/', (req, res) => {
  res.send('Attendance Server is Running and Reachable!');
});

app.get('/test-db', (req, res) => {
  const sql = `INSERT INTO lateness_records (student_id, name, reason, minutes_late) VALUES ('TEST-001', 'Browser Test', 'Testing Connection', 10)`;
  db.execute(sql, (err, result) => {
    if (err) return res.status(500).send("DB Error: " + err.message);
    res.send("Success! Data inserted into MySQL via Phone Browser.");
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});
