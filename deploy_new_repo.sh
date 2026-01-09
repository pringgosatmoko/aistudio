#!/data/data/com.termux/files/usr/bin/bash

# Masuk folder project
cd /sdcard/cadangan || { echo "Folder tidak ditemukan!"; exit 1; }

# Set safe.directory biar Git aman di Termux
git config --global --add safe.directory /storage/emulated/0/cadangan

# Inisialisasi git jika belum
git init

# Hapus remote lama jika ada
git remote remove origin 2>/dev/null

# Minta user input URL repo baru
read -p "Masukkan URL repo GitHub baru (https://github.com/USERNAME/NAMA_REPO.git): " NEW_REPO_URL
git remote add origin "$NEW_REPO_URL"

# Set branch main
git branch -M main

# Tambahkan semua file ke commit
git add .

# Commit lokal
git commit -m "Initial commit SATMOKO Creative Studio AI"

# Push ke GitHub (force aman karena repo baru)
git push -u origin main --force

echo "✅ Deploy selesai! Semua file lokal sudah ada di repo baru."
