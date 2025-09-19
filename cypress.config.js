require('dotenv').config();
const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://auction.lelangmobilku.co.id",
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Set timeout standar biar stabil
    defaultCommandTimeout: 15000,
    requestTimeout: 20000,
    responseTimeout: 20000,
    pageLoadTimeout: 30000,
    
    // Setting buat video & screenshot pas run
    video: true,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    
    // Retry kalau ada test yang gagal
    retries: {
      runMode: 3,
      openMode: 1
    },
    
    // Lokasi file feature & support
    specPattern: "cypress/e2e/features/*.feature",
    supportFile: "cypress/support/e2e.js",
    
    // Variabel env khusus
    env: {
      generateRandomData: true,
      preserveTestData: false,
      fileUploadTimeout: 5000,
      npwpInputTimeout: 10000,
      basicAuth: {
        username: process.env.BASIC_AUTH_USERNAME,
      password: process.env.BASIC_AUTH_PASSWORD
      },
      enableDetailedLogging: true
    },

    async setupNodeEvents(on, config) {
      // Tambahin cucumber preprocessor
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // Event yang valid aja disini - uncaught:exception pindah ke e2e.js
      on('task', {
        log(message) {
          const timestamp = new Date().toISOString();
          console.log(`[${timestamp}] ${message}`);
          return null;
        },
        
        // Generate data testing - pakai DataGenerator
        generateTestData() {
          try {
            // Import DataGenerator
            const path = require('path');
            const dataGeneratorPath = path.join(__dirname, 'cypress/support/utils/dataGenerator.js');
            const DataGenerator = require(dataGeneratorPath);
            
            // Ambil data test dari logic utama
            const testData = DataGenerator.generateTestData(true);
            
            console.log('Generated test data via DataGenerator:', {
              email: testData.email,
              emailLength: testData.email.length,
              mobile: `${testData.nomorTelepon} (${testData.nomorTelepon.length} chars)`,
              company: `${testData.nomorTeleponPerusahaan} (${testData.nomorTeleponPerusahaan.length} chars)`,
              npwp: testData.nomorNpwpFormatted
            });
            
            return testData;
          } catch (error) {
            console.error('Error di generateTestData task:', error);
            console.log('Coba akses DataGenerator di path:', path.join(__dirname, 'cypress/support/utils/dataGenerator.js'));
            
            // Kalau gagal, fallback: bikin data simple langsung
            console.log('Pakai fallback inline generation...');

            const namaDepan = ["Ahmad", "Budi", "Sari"][Math.floor(Math.random() * 3)];
            const namaBelakang = ["Santoso", "Wijaya", "Pratama"][Math.floor(Math.random() * 3)];
            
            // Bikin email simple
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            let randomChars = '';
            for (let i = 0; i < 4; i++) {
              randomChars += chars[Math.floor(Math.random() * chars.length)];
            }
            const email = `test${randomChars}@yopmail.com`;
            
            const fallbackData = {
              namaDepan,
              namaBelakang,
              email,
              nomorKTP: "3171051505851234",
              nomorNpwp: "28.256.368.8-788.486",
              nomorNpwpFormatted: "28.256.368.8-788.486",
              nomorNpwpDigits: "282563688788486",
              nomorTelepon: "081234567890",
              nomorTeleponPerusahaan: "02187654321",
              nomorRekening: "123456789012",
              namaPemilikRekening: `${namaDepan} ${namaBelakang}`
            };
            
            console.log('Pakai fallback data dengan email simple:', fallbackData);
            return fallbackData;
          }
        },

        // Utility buat format NPWP
        formatNPWPSafe(npwpDigits) {
          try {
            if (!npwpDigits || npwpDigits.length !== 15) {
              return null;
            }
            return npwpDigits.replace(/(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/, '$1.$2.$3.$4-$5.$6');
          } catch (error) {
            console.error('Error format NPWP:', error);
            return npwpDigits;
          }
        },

        // Utility buat validasi data testing
        validateTestData(data) {
          const validations = [];
          
          if (data.nomorTelepon && data.nomorTelepon.length < 10) {
            validations.push(`Nomor HP terlalu pendek: ${data.nomorTelepon}`);
          }
          if (data.nomorTeleponPerusahaan && data.nomorTeleponPerusahaan.length < 10) {
            validations.push(`Nomor telepon kantor terlalu pendek: ${data.nomorTeleponPerusahaan}`);
          }
          if (data.email && (!data.email.includes('@yopmail.com') || data.email.length > 25)) {
            validations.push(`Format email salah: ${data.email}`);
          }
          
          if (validations.length > 0) {
            console.error('Validasi data test gagal:', validations);
            throw new Error(`Validation failed: ${validations.join(', ')}`);
          }
          
          console.log('Validasi data test berhasil');
          return true;
        }
      });

      // Setting khusus sebelum browser diluncurkan
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-extensions');
          launchOptions.args.push('--allow-file-access-from-files');
          launchOptions.args.push('--disable-web-security');
        }
        return launchOptions;
      });

      return config;
    },
  },
});
