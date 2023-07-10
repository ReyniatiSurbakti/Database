import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar";

const koneksiMakanan = axios.create({
  baseURL: "http://localhost:5000/api/makanan",
});

export default function ListMakanan() {
  const [makanan, setMakanan] = useState([]);
  const [namaMakanan, setNamaMakanan] = useState("");
  const [tanggalPesanan, setTanggalPesanan] = useState("");
  const [alamatPesanan, setAlamatPesanan] = useState("");
  const [foto, setFoto] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMakanan, setSelectedMakanan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMakanan();
  }, []);

  const fetchMakanan = async () => {
    try {
      const response = await koneksiMakanan.get("/");
      setMakanan(response.data.data);
      setError(null);
    } catch (error) {
      console.error("Error retrieving makanan:", error);
    }
  };

  const handleAddMakanan = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("nama_makanan", namaMakanan);
    formData.append("tanggal_pesanan", tanggalPesanan);
    formData.append("alamat_pesanan", alamatPesanan);
    formData.append("foto", foto);

    try {
      await koneksiMakanan.post("/", formData);
      resetForm();
      setIsAdding(false);
      fetchMakanan();
    } catch (error) {
      console.error("Error adding makanan:", error);
    }
  };

  const handleEditMakanan = async (event) => {
    event.preventDefault();
    const id = selectedMakanan.id;

    const updatedMakanan = {
      nama_makanan: namaMakanan,
      tanggal_pesanan: tanggalPesanan,
      alamat_pesanan: alamatPesanan,
      foto: foto,
    };

    const formData = new FormData();
    formData.append("nama_makanan", updatedMakanan.nama_makanan);
    formData.append("tanggal_pesanan", updatedMakanan.tanggal_pesanan);
    formData.append("alamat_pesanan", updatedMakanan.alamat_pesanan);
    formData.append("foto", updatedMakanan.foto);

    try {
      await koneksiMakanan.put(`/${id}`, formData);
      resetForm();
      setIsEditing(false);
      setSelectedMakanan(null);
      fetchMakanan();
    } catch (error) {
      console.error("Error updating makanan:", error);
    }
  };

  const handleDeleteMakanan = async (id) => {
    try {
      await koneksiMakanan.delete(`/${id}`);
      fetchMakanan();
    } catch (error) {
      console.error("Error deleting makanan:", error);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setSelectedMakanan(null);
    resetForm();
  };

  const handleEdit = (makanan) => {
    setIsAdding(false);
    setIsEditing(true);
    setSelectedMakanan(makanan);
    setNamaMakanan(makanan.nama_makanan);
    setTanggalPesanan(makanan.tanggal_pesanan);
    setAlamatPesanan(makanan.alamat_pesanan);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setSelectedMakanan(null);
    resetForm();
  };

  const resetForm = () => {
    setNamaMakanan("");
    setTanggalPesanan("");
    setAlamatPesanan("");
    setFoto(null);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Daftar Makanan</h1>
        <button className="btn button-warna" onClick={handleAdd}>
          Tambah Makanan
        </button>
        {isAdding && (
          <form className="form-container" onSubmit={handleAddMakanan}>
            <div>
              <label>Nama Makanan:</label>
              <input
                type="text"
                name="nama_makanan"
                value={namaMakanan}
                onChange={(e) => setNamaMakanan(e.target.value)}
              />
            </div>
            <div>
              <label>Tanggal Pesanan:</label>
              <input
                type="date"
                name="tanggal_pesanan"
                value={tanggalPesanan}
                onChange={(e) => setTanggalPesanan(e.target.value)}
              />
            </div>
            <div>
              <label>Alamat Pesanan:</label>
              <textarea
                name="alamat_pesanan"
                value={alamatPesanan}
                onChange={(e) => setAlamatPesanan(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label>Foto:</label>
              <input
                type="file"
                name="foto"
                onChange={(e) => setFoto(e.target.files[0])}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn button-warna">
                Tambah
              </button>
              <button type="button" className="btn button-warna" onClick={handleCancel}>
                Batal
              </button>
            </div>
          </form>
        )}
        {isEditing && selectedMakanan && (
          <form className="form-container" onSubmit={handleEditMakanan}>
            <div>
              <label>Nama Makanan:</label>
              <input
                type="text"
                name="nama_makanan"
                value={namaMakanan}
                onChange={(e) => setNamaMakanan(e.target.value)}
              />
            </div>
            <div>
              <label>Tanggal Pesanan:</label>
              <input
                type="date"
                name="tanggal_pesanan"
                value={tanggalPesanan}
                onChange={(e) => setTanggalPesanan(e.target.value)}
              />
            </div>
            <div>
              <label>Alamat Pesanan:</label>
              <textarea
                name="alamat_pesanan"
                value={alamatPesanan}
                onChange={(e) => setAlamatPesanan(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label>Foto:</label>
              <input
                type="file"
                name="foto"
                onChange={(e) => setFoto(e.target.files[0])}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn button-warna">
                Perbarui
              </button>
              <button type="button" className="btn button-warna" onClick={handleCancel}>
                Batal
              </button>
            </div>
          </form>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>Nama Makanan</th>
              <th>Tanggal Pesanan</th>
              <th>Alamat Pesanan</th>
              <th>Foto</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {makanan.map((makanan) => (
              <tr key={makanan.id}>
                <td>{makanan.nama_makanan}</td>
                <td>{makanan.tanggal_pesanan}</td>
                <td>{makanan.alamat_pesanan}</td>
                <td>
                  {makanan.foto && <img src={makanan.foto} alt="Foto Makanan" width="80" />}
                </td>
                <td>
                  <button className="btn button-warna" onClick={() => handleEdit(makanan)}>
                    Edit
                  </button>
                  <button
                    className="btn button-warna"
                    onClick={() => handleDeleteMakanan(makanan.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
