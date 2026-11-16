const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Menyajikan file statis (CSS, JS, Images, Tim) dari root proyek
app.use(express.static(path.join(__dirname)));

// Rute halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rute halaman tim
app.get('/tim', (req, res) => {
  res.sendFile(path.join(__dirname, 'tim', 'index.html'));
});

// Menjalankan server lokal (hanya jika dijalankan langsung via node index.js)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server PT-CAM berjalan di http://localhost:${PORT}`);
  });
}

// Export untuk kompatibilitas serverless jika dibutuhkan
module.exports = app;
