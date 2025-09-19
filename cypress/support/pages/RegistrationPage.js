// cypress/e2e/pages/RegistrationPage.js
class RegistrationPage {
    constructor() {
        // Elemen form detail dengan selector spesifik
        this.elements = {
            // Bagian data pribadi
            namaDepan: 'input[placeholder="Nama Depan"]',
            namaBelakang: 'input[placeholder="Nama Belakang"]',
            tempatLahir: 'input[placeholder="Tempat Lahir"]',
            tanggalLahir: '[aria-label="Datepicker input"]',
            nomorKTP: 'input[placeholder="Nomor KTP"]',
            uploadKTP: 'input[name="uploadKtp"]',
            uploadKTPButton: 'button:contains("Upload File")',
            masaBerlakuKTP: '.dp__input_icon',
            kewarganegaraan: 'button:contains("WNI")',
            provinsi: 'input[aria-placeholder="Pilih Provinsi"]',
            kota: 'input[aria-placeholder="Pilih Kota"]',
            dropdownOptions: 'ul#multiselect-options li[role="option"]',
            alamat: 'div.mb-5 textarea',
            nomorTelepon: 'input[placeholder="Nomor Telepon"]',
            pekerjaan: 'input[aria-placeholder="Pilih Pekerjaan"]',
            namaPerusahaan: 'input[placeholder="Nama Perusahaan"]',
            alamatPerusahaan: 'div.mb-5 textarea',
            nomorTeleponPerusahaan: 'input[placeholder="Nomor Telepon Perusahaan"]',
            adaNpwp: 'button:contains("Ada NPWP")',
            nomorNpwp: 'input[placeholder="Nomor NPWP"]',
            jenisKendaraan: 'input[aria-placeholder="Jenis Kendaraan"]',
            kendaraanDicari: 'input[aria-placeholder="Pilih Kendaraan"]',
            tujuanPembelian: 'input[aria-placeholder="Pilih Tujuan"]',
            email: 'input[placeholder="Email"]',
            password: 'input[placeholder="Masukkan Kata Sandi Baru"]',
            confirmPassword: 'input[placeholder="Masukkan Ulang Kata Sandi Baru"]',
            passwordLogin: 'input[name="password"]',

            // Bagian data pembayaran
            nomorRekening: 'input[placeholder="Nomor Rekening"]',
            bank: 'input[aria-placeholder="Pilih Bank"]',
            namaRekening: 'input[placeholder="Nama Pemilik Rekening"]',
            sumberDana: 'input[aria-placeholder="Pilih Sumber Tabungan"]',
            metodePembayaran: 'input[aria-placeholder="Pilih Metode Pembayaran"]',

            // Tombol
            btnSelanjutnya: 'button:contains("Selanjutnya")',
            btnDaftar: 'button:contains("Daftar")',

            // Pesan dan status
            successMessage: '.success-message, .alert-success, .toast-success',
            errorMessage: '.error-message, .alert-error, .toast-error',
            loadingSpinner: '.loading, .spinner',

            // Status upload
            uploadPreview: 'div.inline-flex.items-center.cursor-pointer',
            uploadSuccess: '.upload-success, [data-testid="upload-success"]',

            // Navigasi
            loginPage: '.login-redirect, [href*="login"]',

            //captcha
            recaptchaFrame: 'iframe[src*="recaptcha"]',

            acceptToS: '#remember_me',
            btnMasuk: 'button:contains("Masuk")'
        };
    }

    // Fungsi buat navigasi halaman
    visitBaseUrl() {
        cy.visit('/', {
            auth: {
                username: 'jkt',
                password: 'RsonSmW7UgLUKm9',
            },
        });
        cy.log('✅ Visited base URL with authentication');
    }

    visitRegistrationPage() {
        cy.get('a[href="/register"]').click();
        cy.url().should('include', '/register');
        cy.contains('Form Pendaftaran').should('be.visible');
        cy.log('✅ Successfully navigated to registration page');
    }

    // Fungsi input dengan handling error lebih oke
    fillNamaDepan(value) {
        cy.get(this.elements.namaDepan)
            .should('be.visible')
            .clear()
            .type(value)
            .should('have.value', value);
    }

    fillNamaBelakang(value) {
        cy.get(this.elements.namaBelakang)
            .should('be.visible')
            .clear()
            .type(value)
            .should('have.value', value);
    }

    fillTempatLahir(value) {
        cy.get(this.elements.tempatLahir)
            .should('be.visible')
            .clear()
            .type(value)
            .should('have.value', value);
    }

    fillNomorKTP(value) {
        cy.get(this.elements.nomorKTP)
            .should('be.visible')
            .clear()
            .type(value, { force: true })
            .should('have.value', value);
    }

    fillAlamatDomisili(value) {
        cy.get(this.elements.alamat)
            .eq(0)
            .should('be.visible')
            .clear()
            .type(value);
    }

    fillNamaPerusahaan(value) {
        cy.get(this.elements.namaPerusahaan)
            .should('be.visible')
            .clear()
            .type(value)
            .should('have.value', value);
    }

    fillAlamatPerusahaan(value) {
        cy.get(this.elements.alamatPerusahaan)
            .eq(1)
            .should('be.visible')
            .clear()
            .type(value);
    }

    // Fungsi khusus buat isi nomor telepon
    fillNomorTelepon(value) {
        cy.log(`📱 Filling mobile phone with: ${value} (${value.length} chars)`);

        // Cek panjang minimal sebelum diisi
        if (value.length < 10) {
            throw new Error(`Phone number too short: ${value}. Minimum 10 characters required.`);
        }

        // Cek format nomor HP Indonesia
        if (!value.match(/^08\d{8,11}$/)) {
            cy.log(`⚠️  Warning: format nomor HP mungkin salah: ${value}`);
        }

        cy.get(this.elements.nomorTelepon)
            .should('be.visible')
            .clear()
            .type(value, {
                delay: 30,  // Ketik agak lambat biar lebih stabil
                force: true
            })
            .should('have.value', value);

        cy.log(`✅ Mobile phone filled successfully: ${value}`);
    }

    fillNomorTeleponPerusahaan(value) {
        cy.log(`☎️ Filling company phone with: ${value} (${value.length} chars)`);

        // Cek panjang minimal sebelum diisi
        if (value.length < 10) {
            throw new Error(`Company phone too short: ${value}. Minimum 10 characters required.`);
        }

        // Cek format nomor telepon kantor (landline)
        if (!value.match(/^0\d{2,3}\d{7,8}$/)) {
            cy.log(`⚠️  Warning: format nomor kantor mungkin salah: ${value}`);
        }

        cy.get(this.elements.nomorTeleponPerusahaan)
            .should('be.visible')
            .clear()
            .type(value, {
                delay: 30,
                force: true
            })
            .should('have.value', value);

        cy.log(`✅ Company phone filled successfully: ${value}`);
    }

    fillNomorNPWP(value) {
        cy.get(this.elements.nomorNpwp)
          .should('be.visible')
          .clear()
          .type(value)
        //   .should('have.value', value);
      }

    fillEmail(value) {
        cy.get(this.elements.email)
            .should('be.visible')
            .clear()
            .type(value)
            .should('have.value', value);
    }

    fillPassword(value) {
        cy.get(this.elements.password)
            .should('be.visible')
            .clear()
            .type(value);
    }

    fillPasswordLogin(value) {
        cy.get(this.elements.passwordLogin)
            .should('be.visible')
            .clear()
            .type(value);
    }

    fillConfirmPassword(value) {
        cy.get(this.elements.confirmPassword)
            .should('be.visible')
            .clear()
            .type(value);
    }

    fillNomorRekening(value) {
        cy.get(this.elements.nomorRekening)
            .should('be.visible')
            .clear()
            .type(value)
            .should('have.value', value);
    }

    fillNamaRekening(value) {
        cy.get(this.elements.namaRekening)
            .should('be.visible')
            .clear()
            .type(value)
            .should('have.value', value);
    }

    // Fungsi pilih tanggal (datepicker)
    pilihTanggalLahir = (dateStr) => {
        const [day, month, year] = dateStr.split('/');
        cy.log(`Selecting DOB: ${day}-${month}-${year}`);

        // klik container atau icon buat buka datepicker
        cy.get('[aria-label="Datepicker input"]')
            .first()
            .should('exist')
            .should('be.visible')
            .click({ force: true }); // buka datepicker

        // pilih tahun
        cy.get('.dp__month_year_select[aria-label="Open years overlay"]')
            .should('exist')
            .should('be.visible')
            .click({ force: true });

        cy.get('.dp__overlay_cell')
            .contains(year)
            .should('exist')
            .scrollIntoView()
            .click({ force: true });

        // pilih bulan
        cy.get('.dp__month_year_select[aria-label="Open months overlay"]')
            .should('exist')
            .should('be.visible')
            .click({ force: true });

        cy.get('.dp__overlay_cell')
            .eq(parseInt(month) - 1)
            .should('exist')
            .scrollIntoView()
            .click({ force: true });

        // pilih hari
        cy.get('.dp__cell_inner.dp__pointer.dp__date_hover')
            .contains(new RegExp(`^${parseInt(day)}$`))
            .should('exist')
            .scrollIntoView()
            .click({ force: true });

        // klik tombol Select yang kelihatan
        cy.get('.dp__action.dp__select')
            .filter(':visible')
            .first()
            .click({ force: true })
            .then(() => cy.log('Date selection completed'));
    }

    pilihMasaBerlakuKTP(dateStr) {
        const [day, month, year] = dateStr.split('/');
        cy.log(`Selecting KTP expiry: ${day}-${month}-${year}`);

        cy.get(this.elements.masaBerlakuKTP)
            .eq(1)
            .should('be.visible')
            .click({ force: true });

        // pilih tahun
        cy.get('.dp__month_year_select[aria-label="Open years overlay"]')
            .should('be.visible')
            .click({ force: true });

        cy.get('.dp__instance_calendar')
            .contains(year)
            .should('be.visible')
            .scrollIntoView()
            .click({ force: true });

        // pilih bulan
        cy.get('.dp__month_year_select[aria-label="Open months overlay"]')
            .should('be.visible')
            .click({ force: true });

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthName = monthNames[parseInt(month) - 1];

        cy.get('.dp__instance_calendar')
            .contains(monthName)
            .should('be.visible')
            .scrollIntoView()
            .click({ force: true });

        // pilih hari
        cy.get('.dp__calendar')
            .contains(new RegExp(`^${parseInt(day)}$`))
            .should('be.visible')
            .scrollIntoView()
            .click({ force: true });

        // klik tombol Select
        cy.get('.dp__action.dp__select')
            .filter(':visible')
            .first()
            .click({ force: true });

        cy.log('✅ KTP expiry date selected successfully');
    }

    // FIXED: cara upload KTP diperbaiki biar nggak error
    uploadKTPFile(fileName) {
        cy.log(`🔄 Mulai upload file KTP: ${fileName}`);

        // Step 1: pastikan tombol upload kelihatan dan klik
        cy.get(this.elements.uploadKTPButton)
            .should('be.visible')
            .click({ force: true });

        cy.log('✅ Tombol upload diklik');

        // Step 2: proses upload file coba beberapa cara
        cy.fixture(fileName, 'base64').then(fileContent => {
            const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/jpeg');

            // Cara 1: langsung manipulasi input file
            cy.get(this.elements.uploadKTP).then($input => {
                const el = $input[0];
                const testFile = new File([blob], fileName, { type: 'image/jpeg' });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(testFile);

                el.files = dataTransfer.files;

                // Trigger event biar ke-detect
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('input', { bubbles: true }));

                cy.log('✅ File udah ke-attach di input');
            });

            // Cara 2: pakai selectFile kalau ada
            cy.get(this.elements.uploadKTP, { timeout: 5000 }).then($input => {
                if ($input.length > 0) {
                    cy.wrap($input).selectFile({
                        contents: blob,
                        fileName: fileName,
                        mimeType: 'image/jpeg'
                    }, { force: true });
                }
            });
        });

        // Step 3: tunggu upload kelar
        cy.wait(3000); // kasih waktu proses upload

        // Step 4: cek hasil upload
        this.verifyKTPUploaded();

        cy.log('✅ Upload KTP kelar');
    }

    // Cek lagi hasil upload KTP
    verifyKTPUploaded() {
        cy.log('🔍 Cek status upload KTP...');

        // cek beberapa indikator berhasil
        cy.get('body').then($body => {
            if ($body.find(this.elements.uploadPreview).length > 0) {
                cy.get(this.elements.uploadPreview)
                    .should('be.visible')
                    .and('contain.text', 'Preview');
                cy.log('✅ Ada preview upload');
            }

            // cek indikator upload sukses
            if ($body.find('.upload-complete, .file-uploaded, [data-testid*="upload"]').length > 0) {
                cy.get('.upload-complete, .file-uploaded, [data-testid*="upload"]')
                    .should('be.visible');
                cy.log('✅ Ada indikator upload sukses');
            }

            // cek input file beneran ada filenya
            cy.get(this.elements.uploadKTP).should(($input) => {
                expect($input[0].files.length).to.be.greaterThan(0);
            });
            cy.log('✅ Input file ada filenya');
        });

        // pastiin nggak ada pesan error upload
        cy.get('body').should('not.contain', 'Upload failed')
            .should('not.contain', 'File upload error')
            .should('not.contain', 'Invalid file format');

        cy.log('✅ Verifikasi upload KTP beres');
    }

    // Fungsi pilih dropdown (kewarganegaraan, provinsi, dll)
    pilihKewarganegaraan(value) {
        cy.get(this.elements.kewarganegaraan)
            .contains(value)
            .should('be.visible')
            .click();
        cy.log(`✅ Selected Kewarganegaraan: ${value}`);
    }

    pilihProvinsi(value) {
        cy.get(this.elements.provinsi).click();
        cy.get(this.elements.dropdownOptions).contains(value).click();
        cy.log(`✅ Selected Provinsi: ${value}`);
    }

    pilihKota(value) {
        cy.wait(3000); // tunggu list kota muncul
        cy.get(this.elements.kota).click();
        cy.get(this.elements.dropdownOptions).contains(value).click();
        cy.log(`✅ Selected Kota: ${value}`);
    }

    pilihPekerjaan(value) {
        cy.get(this.elements.pekerjaan).click();
        cy.get(this.elements.dropdownOptions).contains(value).click();
        cy.log(`✅ Selected Pekerjaan: ${value}`);
    }

    pilihNPWP(value) {
        cy.get(this.elements.adaNpwp).contains(value).click();
        cy.log(`✅ Selected NPWP: ${value}`);
    }

    pilihKendaraan(value) {
        cy.get(this.elements.jenisKendaraan).click();
        cy.get(this.elements.dropdownOptions).contains(value).click();
        cy.log(`✅ Selected Jenis Kendaraan: ${value}`);
    }

    pilihKendaraanDicari(value) {
        cy.get(this.elements.kendaraanDicari).click();
        cy.get(this.elements.dropdownOptions).contains(value).click();
        cy.log(`✅ Selected Kendaraan Dicari: ${value}`);
    }

    pilihTujuan(value) {
        cy.get(this.elements.tujuanPembelian).click();
        cy.get(this.elements.dropdownOptions).contains(value).click();
        cy.log(`✅ Selected Tujuan Pembelian: ${value}`);
    }

    pilihBank(value) {
        cy.get(this.elements.bank).click();
        cy.get(this.elements.dropdownOptions).contains(value).click();
        cy.log(`✅ Selected Bank: ${value}`);
    }

    pilihSumberDana(value) {
        cy.get(this.elements.sumberDana).click();
        cy.get(this.elements.dropdownOptions).contains(value).click();
        cy.log(`✅ Selected Sumber Dana: ${value}`);
    }

    pilihMetodePembayaran(value) {
        cy.get(this.elements.metodePembayaran).click();
        cy.get(this.elements.dropdownOptions).contains(value).click();
        cy.log(`✅ Selected Metode Pembayaran: ${value}`);
    }

    // Fungsi klik tombol (Selanjutnya, Daftar)
    clickNext() {
        // pastiin semua field wajib diisi dulu
        cy.get(this.elements.btnSelanjutnya)
            .should('be.visible')
            .and('not.be.disabled')
            .click();
        cy.log('✅ Klik tombol Selanjutnya');
    }

    clickRegister() {
        // cek form siap sebelum submit
        this.verifyFormReadyForSubmission();

        cy.get(this.elements.btnDaftar)
            .should('be.visible')
            .and('not.be.disabled')
            .click();
        cy.log('✅ Klik tombol Daftar');
    }

    // Fungsi buat verifikasi form
    verifyFormReadyForSubmission() {
        cy.log('🔍 Cek form siap buat submit...');

        // cek KTP masih ke-upload
        cy.get(this.elements.uploadKTP).should(($input) => {
            expect($input[0].files.length).to.be.greaterThan(0);
        });

        // cek kalau nggak ada pesan error
        cy.get('body').should('not.contain', 'This field is required')
            .should('not.contain', 'Invalid format')
            .should('not.contain', 'Upload file first');

        cy.log('✅ Form siap di-submit');
    }

    verifyRequiredFieldsFilled() {
        // pastiin field penting nggak kosong
        cy.get(this.elements.namaDepan).should('not.have.value', '');
        cy.get(this.elements.namaBelakang).should('not.have.value', '');
        cy.get(this.elements.email).should('not.have.value', '');
        cy.log('✅ Verifikasi field wajib beres');
    }

    verifyRegistrationSuccess() {
        cy.get(this.elements.successMessage, { timeout: 15000 })
            .should('be.visible')
            .and('contain', 'berhasil');
        cy.log('✅ Registrasi berhasil diverifikasi');
    }

    verifyEmailConfirmation() {
        cy.log('📧 Verifikasi email konfirmasi (mock)');
    }

    verifyRedirectToLogin() {
        cy.url({ timeout: 10000 }).should('include', '/login');
        cy.contains('Selamat Datang').should('be.visible');
        cy.log('✅ Berhasil diarahkan ke halaman login');
    }

    checkRecaptcha() {
        cy.get(this.elements.recaptchaFrame).then($iframe => {
          const $body = $iframe.contents().find('body');
          cy.wrap($body)
            .find(this.elements.recaptchaFrame)
            .click({ force: true });
        });
    }  
    
    acceptTermsIfPresent() {
        cy.get('body').then($body => {
          if ($body.find(this.elements.acceptToS).length > 0) {
            cy.log('Terms checkbox found - checking it');
            cy.get(this.elements.acceptToS)
              .should('be.visible')
              .check({ force: true });
            cy.log('Terms accepted');
          } else {
            cy.log('No terms checkbox found');
          }
        });
    }

    clickLogin() {
        cy.log('Clicking login button');
        
        cy.get(this.elements.btnMasuk)
          .should('be.visible')
          .should('not.be.disabled')
          .click();
        
        cy.log('Login button clicked');
      }
}



export default RegistrationPage;