require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'Todo App';

app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tododb',
  waitForConnections: true,
  connectionLimit: 10,
});

// Init DB table
async function initDB() {
  try {
    const conn = await pool.getConnection();
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    conn.release();
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
    setTimeout(initDB, 5000);
  }
}

// ─── ROUTES ────────────────────────────────────────────────

// GET /health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: APP_NAME, timestamp: new Date().toISOString() });
});

// GET /about
app.get('/about', (req, res) => {
  res.json({
    student_name: process.env.STUDENT_NAME || '[TEN_SINH_VIEN]',
    student_id:   process.env.STUDENT_ID   || '[MSSV]',
    class:        process.env.STUDENT_CLASS || '[LOP]',
    app:          APP_NAME,
    version:      '1.0.0',
    description:  'Todo App - DevOps Mini Project'
  });
});

// GET /todos  — lấy tất cả todos
app.get('/todos', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM todos ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /todos/:id
app.get('/todos/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /todos  — tạo todo mới
app.post('/todos', async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
  try {
    const [result] = await pool.execute(
      'INSERT INTO todos (title, description) VALUES (?, ?)',
      [title, description || '']
    );
    const [rows] = await pool.execute('SELECT * FROM todos WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /todos/:id  — cập nhật todo
app.put('/todos/:id', async (req, res) => {
  let { title, description, completed } = req.body;

  try {
    await pool.execute(
      `UPDATE todos 
       SET 
         title = COALESCE(?, title),
         description = COALESCE(?, description),
         completed = COALESCE(?, completed)
       WHERE id = ?`,
      [
        title ?? null,                         
        description ?? null,                  
        completed !== undefined ? Number(completed) : null,
        req.params.id
      ]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM todos WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }

    res.json({ success: true, data: rows[0] });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// DELETE /todos/:id
app.delete('/todos/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM todos WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── START ──────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 ${APP_NAME} running on port ${PORT}`);
  });
}); 