

// Step definition registrasi, sudah ditambah handling NPWP & Nomor Telepon
// cypress/support/step_definitions/registration_steps.js

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import RegistrationPage from '../pages/RegistrationPage';

const registrationPage = new RegistrationPage();
let testData = {}; 

// Langkah awal (Background)
Given('saya berada di halaman registrasi UC Auction', () => {
  // Ambil data test dari task Cypress
  cy.task('generateTestData').then((data) => {
    testData = data;
    cy.log('🎲 Data test dibuat:', testData);
    cy.wrap(data).as('testData'); // Simpan biar bisa dipakai lagi
    
    // Log detail data biar gampang dicek
    cy.log(`📱 Nomor HP: ${data.nomorTelepon} (${data.nomorTelepon.length} digit)`);
    cy.log(`☎️  Nomor Kantor: ${data.nomorTeleponPerusahaan} (${data.nomorTeleponPerusahaan.length} digit)`);
    cy.log(`🔢 NPWP Format: ${data.nomorNpwpFormatted}`);
    cy.log(`🔢 NPWP Angka: ${data.nomorNpwpDigits}`);
  });
  
  registrationPage.visitBaseUrl();
  registrationPage.visitRegistrationPage();
});

Given('form {string} ditampilkan', (formName) => {
  cy.contains(formName).should('be.visible');
});

// Isi data pribadi dengan tambahan handling NPWP & Nomor Telepon
Given('saya isi {string} dengan {string}', (fieldName, value) => {
  // Kalau value pakai placeholder {{ }}, ambil dari testData
  let actualValue = value;
  
  switch (fieldName) {
    case 'Nama Depan':
      actualValue = value.includes('{{') ? testData.namaDepan : value;
      registrationPage.fillNamaDepan(actualValue);
      break;
      
    case 'Nama Belakang':
      actualValue = value.includes('{{') ? testData.namaBelakang : value;
      registrationPage.fillNamaBelakang(actualValue);
      break;
      
    case 'Tempat Lahir':
      registrationPage.fillTempatLahir(actualValue);
      break;
      
    case 'Tanggal Lahir':
      registrationPage.pilihTanggalLahir(actualValue);
      break;
      
    case 'Nomor KTP':
      actualValue = value.includes('{{') ? testData.nomorKTP : value;
      registrationPage.fillNomorKTP(actualValue);
      break;
      
    case 'Masa Berlaku KTP':
      registrationPage.pilihMasaBerlakuKTP(actualValue);
      break;
      
    case 'Alamat Domisili':
      registrationPage.fillAlamatDomisili(actualValue);
      break;
      
    case 'Nama Perusahaan':
      registrationPage.fillNamaPerusahaan(actualValue);
      break;
      
    case 'Alamat Perusahaan':
      registrationPage.fillAlamatPerusahaan(actualValue);
      break;
      
    case 'Nomor Telepon':
      // Isi nomor HP, cek juga validasi panjangnya
      if (value.includes('{{')) {
        actualValue = testData.nomorTelepon;
        
        // Cek panjang minimal 10 digit
        if (actualValue.length < 10) {
          throw new Error(`Nomor HP terlalu pendek: ${actualValue} (${actualValue.length} digit)`);
        }
        
        cy.log(`📱 Nomor HP dipakai: ${actualValue} (${actualValue.length} digit)`);
      }
      registrationPage.fillNomorTelepon(actualValue,  { parseSpecialCharSequences: false });
      break;
      
    case 'Nomor Telepon Perusahaan':
      // Isi nomor telepon kantor
      if (value.includes('{{')) {
        actualValue = testData.nomorTeleponPerusahaan;
        
        // Cek panjang minimal 10 digit
        if (actualValue.length < 10) {
          throw new Error(`Nomor kantor terlalu pendek: ${actualValue} (${actualValue.length} digit)`);
        }
        
        cy.log(`☎️ Nomor kantor dipakai: ${actualValue} (${actualValue.length} digit)`);
      }
      registrationPage.fillNomorTeleponPerusahaan(actualValue);
      break;
      
    case 'Nomor NPWP':
      // Isi NPWP, pilih format sesuai field
      if (value.includes('{{')) {
        // Cek apakah field butuh format dengan titik/dash atau angka polos
        cy.get(registrationPage.elements.nomorNpwp).then($field => {
          const placeholder = $field.attr('placeholder') || '';
          const maxLength = $field.attr('maxlength');
          
          if (placeholder.includes('.') || placeholder.includes('-') || maxLength === '18') {
            // Kalau field minta format
            actualValue = testData.nomorNpwpFormatted;
            cy.log(`🔢 NPWP format dipakai: ${actualValue}`);
            registrationPage.fillNomorNPWPWithFormatting(actualValue);
          } else {
            // Kalau field auto-format / hanya angka
            actualValue = testData.nomorNpwpDigits;
            cy.log(`🔢 NPWP angka saja dipakai: ${actualValue}`);
            registrationPage.fillNomorNPWP(actualValue);
          }
        });
      } else {
        // Kalau value statis, isi langsung
        registrationPage.fillNomorNPWPSmart(actualValue);
      }
      break;
      
    case 'Email':
      actualValue = value.includes('{{') ? testData.email : value;
      registrationPage.fillEmail(actualValue);
      break;
      
    case 'Kata Sandi':
      registrationPage.fillPassword(actualValue);
      break;
      
    case 'Konfirmasi Kata Sandi':
      registrationPage.fillConfirmPassword(actualValue);
      break;
      
    case 'Nomor Rekening':
      actualValue = value.includes('{{') ? testData.nomorRekening : value;
      registrationPage.fillNomorRekening(actualValue);
      break;
      
    case 'Nama Rekening':
      actualValue = value.includes('{{') ? testData.namaPemilikRekening : value;
      registrationPage.fillNamaRekening(actualValue);
      break;

    case 'Email':
      registrationPage.fillEmail(actualValue);
    break;

    case 'Password':
      registrationPage.fillPasswordLogin(actualValue);
    break;
      
    default:
      throw new Error(`Field "${fieldName}" belum dikenali`);
  }
  
  cy.log(`✅ Field ${fieldName} sudah diisi: ${actualValue}`);
});

// Step lain untuk isi dropdown
Given('saya pilih {string} dengan {string}', (fieldName, value) => {
  switch (fieldName) {
    case 'Pekerjaan':
      registrationPage.pilihPekerjaan(value);
      break;
    case 'Kewarganegaraan':
      registrationPage.pilihKewarganegaraan(value);
      break;
    case 'Provinsi':
      registrationPage.pilihProvinsi(value);
      break;
    case 'Kota':
      registrationPage.pilihKota(value);
      break;
    case 'NPWP':
      registrationPage.pilihNPWP(value);
      break;
    case 'Jenis Kendaraan':
      registrationPage.pilihKendaraan(value);
      break;
    case 'Kendaraan yang dicari':
      registrationPage.pilihKendaraanDicari(value);
      break;
    case 'Tujuan Pembelian':
      registrationPage.pilihTujuan(value);
      break;
    case 'Bank':
      registrationPage.pilihBank(value);
      break;
    case 'Sumber Dana':
      registrationPage.pilihSumberDana(value);
      break;
    case 'Metode Pembayaran':
      registrationPage.pilihMetodePembayaran(value);
      break;
    default:
      throw new Error(`Dropdown "${fieldName}" belum dikenali`);
  }
});

Given('saya upload file KTP valid {string}', (fileName) => {
  registrationPage.uploadKTPFile(fileName);
  // Tunggu sebentar biar upload selesai
  cy.wait(2000);
  registrationPage.verifyKTPUploaded();
});

// Step aksi klik tombol
When('saya klik tombol {string} dan lengkapi data pembayaran', (buttonText) => {
  registrationPage.clickNext();
  
  // Pastikan berhasil masuk ke halaman pembayaran
  cy.contains('Data Pembayaran', { timeout: 10000 }).should('be.visible');
  cy.log('✅ Berhasil masuk ke halaman Data Pembayaran');
});

When('saya klik tombol {string}', (buttonText) => {
  if (buttonText === 'Daftar') {
    // Kasih jeda sedikit sebelum submit terakhir
    cy.wait(1000);
    registrationPage.clickRegister();
  } else if (buttonText === 'Selanjutnya') {
    registrationPage.clickNext();
  }
});

// Step untuk verifikasi hasil
Then('saya harus melihat pesan {string}', (expectedMessage) => {
  cy.contains(expectedMessage, { timeout: 15000 })
    .should('be.visible')
    .then(() => {
      cy.log(`✅ Pesan berhasil diverifikasi: ${expectedMessage}`);
    });
});

Then('saya harus menerima email konfirmasi', () => {
  // Simulasi cek email, cuma log aja
  cy.get('@testData').then((data) => {
    cy.log(`📧 Email konfirmasi dikirim ke: ${data.email}`);
  });
  registrationPage.verifyEmailConfirmation();
});

Then('saya harus diarahkan ke halaman login', () => {
  registrationPage.verifyRedirectToLogin();
});

// Validasi tambahan untuk NPWP & Telepon
Given('format NPWP harus valid', () => {
  cy.get(registrationPage.elements.nomorNpwp).should(($input) => {
    const value = $input.val();
    // Cek apakah sesuai format NPWP Indonesia: XX.XXX.XXX.X-XXX.XXX atau 15 digit angka
    expect(value).to.match(/^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$|^\d{15}$/);
  });
  cy.log('✅ Format NPWP valid');
});

Given('nomor telepon harus minimal 10 karakter', () => {
  // Cek nomor HP
  cy.get(registrationPage.elements.nomorTelepon).should(($input) => {
    const value = $input.val();
    expect(value.length).to.be.at.least(10);
    expect(value).to.match(/^08\d{8,11}$/); // Format nomor HP Indonesia
  });
  
  cy.log('✅ Nomor HP valid');
});

Given('nomor telepon perusahaan harus minimal 10 karakter', () => {
  // Cek nomor kantor
  cy.get(registrationPage.elements.nomorTeleponPerusahaan).should(($input) => {
    const value = $input.val();
    expect(value.length).to.be.at.least(10);
    expect(value).to.match(/^0\d{2,3}\d{7,8}$/); // Format nomor kantor Indonesia
  });
  
  cy.log('✅ Nomor kantor valid');
});

// Debug: tampilkan semua data test yang dipakai
// When('saya lihat data test yang digunakan', () => {
//   cy.get('@testData').then((data) => {
//     cy.log('Data test yang dipakai:');
//     cy.log(`Nama: ${data.namaDepan} ${data.namaBelakang}`);
//     cy.log(`Email: ${data.email}`);
//     cy.log(`KTP: ${data.nomorKTP}`);
//     cy.log(`HP: ${data.nomorTelepon} (${data.nomorTelepon.length} digit)`);
//     cy.log(`Kantor: ${data.nomorTeleponPerusahaan} (${data.nomorTeleponPerusahaan.length} digit)`);
//     cy.log(`NPWP: ${data.nomorNpwpFormatted}`);
//     cy.log(`Rekening: ${data.nomorRekening}`);
//   });
// });

// Step buat pastikan semua nomor telepon sesuai aturan minimum
Then('semua nomor telepon harus memenuhi syarat minimum', () => {
  cy.get('@testData').then((data) => {
    // Validasi HP
    expect(data.nomorTelepon.length).to.be.at.least(10);
    expect(data.nomorTelepon).to.match(/^08\d{8,11}$/);
    
    // Validasi kantor
    expect(data.nomorTeleponPerusahaan.length).to.be.at.least(10);
    expect(data.nomorTeleponPerusahaan).to.match(/^0\d{2,3}\d{7,8}$/);
    
    cy.log('✅ Semua nomor telepon sesuai syarat minimum');
  });
});

Then('saya login dengan email dan kata sandi', (fieldName, value) => {
  switch(fieldName) {
    
  }
})

Then('saya klik box recaptcha', (fieldName, value) => {
  registrationPage.checkRecaptcha();
})

Then('saya klik accept Terms of Service', (fieldName, value) => {
  registrationPage.acceptTermsIfPresent();
})

Then('saya klik tombol Masuk', (fieldName, value) => {
  registrationPage.clickLogin();
})