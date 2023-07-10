const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;

const multer = require('multer');
const path = require('path');
const cors = require('cors');

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));

// script upload
app.use(express.static("./public"));
//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/'); // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    }
});

var upload = multer({
    storage: storage
}); // script untuk penggunaan multer saat upload

// create data / insert data
app.post('/api/makanan', upload.single('foto'), (req, res) => {
    const { nama_makanan, tanggal_pesanan, alamat_pesanan } = req.body;
    const foto = req.file ? 'http://localhost:5000/images/' + req.file.filename : null;

    const querySql =
        'INSERT INTO makanan (nama_makanan, tanggal_pesanan, alamat_pesanan, foto) VALUES (?, ?, ?, ?)';

    koneksi.query(
        querySql,
        [nama_makanan, tanggal_pesanan, alamat_pesanan, foto],
        (err, rows, field) => {
            if (err) {
                return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }

            res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        }
    );
});

// read data / get data
app.get('/api/makanan', (req, res) => {
    const querySql = 'SELECT * FROM makanan';

    koneksi.query(querySql, (err, rows, field) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        res.status(200).json({ success: true, data: rows });
    });
});

// update data
app.put('/api/makanan/:id', upload.single('foto'), (req, res) => {
    const id = req.params.id;
    const { nama_makanan, tanggal_pesanan, alamat_pesanan } = req.body;
    const foto = req.file ? 'http://localhost:5000/images/' + req.file.filename : null;

    const query =
        'UPDATE makanan SET nama_makanan = ?, tanggal_pesanan = ?, alamat_pesanan = ?, foto = ? WHERE id = ?';

    koneksi.query(
        query,
        [nama_makanan, tanggal_pesanan, alamat_pesanan, foto, id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: 'Terjadi kesalahan saat memperbarui data makanan'
                });
            }

            res.json({ message: 'Data makanan berhasil diperbarui' });
        }
    );
});

// delete data
app.delete('/api/makanan/:id', (req, res) => {
    const id = req.params.id;

    const querySearch = 'SELECT * FROM makanan WHERE id = ?';
    const queryDelete = 'DELETE FROM makanan WHERE id = ?';

    koneksi.query(querySearch, id, (err, rows, fields) => {
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        if (rows.length) {
            koneksi.query(queryDelete, id, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                if (result.affectedRows > 0) {
                    res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
                } else {
                    res.status(500).json({ success: false, message: 'Gagal menghapus data!' });
                }
            });
        } else {
            res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// buat server nya
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
