Feature: Registrasi User Berhasil
  As a calon user lelang mobil
  I want to mendaftar dengan data lengkap yang valid
  So that saya bisa berpartisipasi dalam lelang

  Background:
    Given saya berada di halaman registrasi UC Auction

  @smoke @registration @positive
  Scenario: Registrasi berhasil dengan data random yang valid
    # Personal Data Section
    Given saya isi "Nama Depan" dengan "{{namaDepan}}"
    And saya isi "Nama Belakang" dengan "{{namaBelakang}}"
    And saya isi "Tempat Lahir" dengan "Jakarta"
    And saya isi "Tanggal Lahir" dengan "15/05/1985"
    And saya isi "Nomor KTP" dengan "{{nomorKTP}}"
    And saya upload file KTP valid "ktp.jpg"
    And saya isi "Masa Berlaku KTP" dengan "01/12/2025"
    And saya pilih "Kewarganegaraan" dengan "WNI"
    And saya pilih "Provinsi" dengan "DKI Jakarta"
    And saya pilih "Kota" dengan "Jakarta Barat"
    And saya isi "Alamat Domisili" dengan "Jl. Benama No.123"
    And saya isi "Nomor Telepon" dengan "{{nomorTelepon}}"
    
    # Professional Data Section
    And saya pilih "Pekerjaan" dengan "Pegawai Swasta"
    And saya isi "Nama Perusahaan" dengan "LGQ Inc"
    And saya isi "Alamat Perusahaan" dengan "Jalan Bersama Nomor 101"
    And saya isi "Nomor Telepon Perusahaan" dengan "{{nomorTeleponPerusahaan}}"
    
    # NPWP Section
    And saya pilih "NPWP" dengan "Ada NPWP"
    And saya isi "Nomor NPWP" dengan "{{nomorNpwp}}"
    
    # Vehicle Preference Section
    And saya pilih "Jenis Kendaraan" dengan "Mobil"
    And saya pilih "Kendaraan yang dicari" dengan "Kendaraan Niaga"
    And saya pilih "Tujuan Pembelian" dengan "Kantor/Usaha"
    
    # Account Data Section
    And saya isi "Email" dengan "{{email}}"
    And saya isi "Kata Sandi" dengan "Rah@si4_123!"
    And saya isi "Konfirmasi Kata Sandi" dengan "Rah@si4_123!"
    
    # Navigate to Payment Section
    When saya klik tombol "Selanjutnya" dan lengkapi data pembayaran
    
    # Payment Data Section
    And saya isi "Nomor Rekening" dengan "{{nomorRekening}}"
    And saya pilih "Bank" dengan "BCA"
    And saya isi "Nama Rekening" dengan "{{namaPemilikRekening}}"
    And saya pilih "Sumber Dana" dengan "Gaji/Upah"
    And saya pilih "Metode Pembayaran" dengan "Debit"
    
    # Final Registration
    When saya klik tombol "Daftar"
    
    # Verification
    Then saya harus melihat pesan "Data baru berhasil ditambahkan"
    And saya harus menerima email konfirmasi
    And saya harus diarahkan ke halaman login

    # And saya isi "Email" dengan "{{email}}"
    # And saya isi "Password" dengan "Rah@si4_123!"
    # And saya klik box recaptcha
    # And saya klik accept Terms of Service
    # And saya klik tombol Masuk
    
    


    
#   @regression @registration @validation
#   Scenario: Validasi format data input
#     Given saya isi "Nama Depan" dengan "{{namaDepan}}"
#     And saya isi "Nama Belakang" dengan "{{namaBelakang}}"
#     And saya isi "Nomor Telepon" dengan "{{nomorTelepon}}"
#     And saya isi "Nomor Telepon Perusahaan" dengan "{{nomorTeleponPerusahaan}}"
#     And saya isi "Nomor NPWP" dengan "{{nomorNpwp}}"
#     And saya lihat data test yang digunakan
#     Then nomor telepon harus minimal 10 karakter
#     And nomor telepon perusahaan harus minimal 10 karakter
#     And format NPWP harus valid
#     And semua nomor telepon harus memenuhi syarat minimum

#   @regression @registration @negative
#   Scenario: Registrasi gagal tanpa upload KTP
#     Given saya isi "Nama Depan" dengan "{{namaDepan}}"
#     And saya isi "Nama Belakang" dengan "{{namaBelakang}}"
#     And saya isi "Email" dengan "{{email}}"
#     And saya isi "Nomor Telepon" dengan "{{nomorTelepon}}"
#     And saya isi "Kata Sandi" dengan "TestPassword123!"
#     And saya isi "Konfirmasi Kata Sandi" dengan "TestPassword123!"
#     # Skip KTP upload intentionally
#     When saya klik tombol "Selanjutnya"
#     Then saya harus melihat pesan "KTP harus diupload"

#   @regression @registration @negative  
#   Scenario: Registrasi gagal dengan email duplikat
#     Given saya isi "Nama Depan" dengan "{{namaDepan}}"
#     And saya isi "Nama Belakang" dengan "{{namaBelakang}}"
#     And saya isi "Email" dengan "existing.user@yopmail.com"
#     And saya isi "Nomor Telepon" dengan "{{nomorTelepon}}"
#     And saya isi "Kata Sandi" dengan "TestPassword123!"
#     And saya isi "Konfirmasi Kata Sandi" dengan "TestPassword123!"
#     And saya upload file KTP valid "ktp.jpg"
#     When saya klik tombol "Selanjutnya"
#     Then saya harus melihat pesan "Email sudah terdaftar"

#   @regression @registration @negative
#   Scenario: Registrasi gagal dengan nomor telepon terlalu pendek
#     Given saya isi "Nama Depan" dengan "{{namaDepan}}"
#     And saya isi "Nama Belakang" dengan "{{namaBelakang}}"
#     And saya isi "Email" dengan "{{email}}"
#     And saya isi "Nomor Telepon" dengan "08123"
#     And saya isi "Kata Sandi" dengan "TestPassword123!"
#     And saya isi "Konfirmasi Kata Sandi" dengan "TestPassword123!"
#     And saya upload file KTP valid "ktp.jpg"
#     When saya klik tombol "Selanjutnya"
#     Then saya harus melihat pesan "Nomor telepon minimal 10 karakter"

#   @debug @registration
#   Scenario: Debug test data generation
#     Given saya lihat data test yang digunakan
#     Then semua nomor telepon harus memenuhi syarat minimum
#     And format NPWP harus valid

#   @performance @registration
#   Scenario: Test performa input data dengan validasi
#     Given saya isi "Nama Depan" dengan "{{namaDepan}}"
#     And saya isi "Nama Belakang" dengan "{{namaBelakang}}"
#     And saya isi "Nomor Telepon" dengan "{{nomorTelepon}}"
#     And saya isi "Nomor Telepon Perusahaan" dengan "{{nomorTeleponPerusahaan}}"
#     And saya isi "Nomor NPWP" dengan "{{nomorNpwp}}"
#     And saya isi "Email" dengan "{{email}}"
#     And saya upload file KTP valid "ktp.jpg"
#     And saya tunggu 2 detik
#     Then semua field wajib sudah terisi