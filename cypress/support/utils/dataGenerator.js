// Enhanced DataGenerator with new email format: namaDepan + namaBelakang + 5 digits
// cypress/support/utils/dataGenerator.js

class DataGenerator {
    static generateRandomName() {
      const namaDepanList = ["ahmad", "budi", "sari", "dewi", "andi", "maya", "rizki", "indah", "arif", "lina"];
      const namaBelakangList = ["santoso", "wijaya", "pratama", "sari", "kusuma", "hartono", "permana", "salsabila", "nugraha", "putri"];
      
      const namaDepan = namaDepanList[Math.floor(Math.random() * namaDepanList.length)];
      const namaBelakang = namaBelakangList[Math.floor(Math.random() * namaBelakangList.length)];
      
      return { namaDepan, namaBelakang };
    }
  
    static generateRandomKTP() {
      // Format KTP Indonesia: 16 digit
      const kodeProvinsi = "31";
      const kodeKota = "71";
      const tanggalLahir = "150585";
      const nomorUrut = Math.floor(Math.random() * 9000 + 1000);
      const checkDigit = Math.floor(Math.random() * 90 + 10);
      
      return `${kodeProvinsi}${kodeKota}${tanggalLahir}${nomorUrut}${checkDigit}`;
    }
  
    static generateRandomEmail() {
      // NEW FORMAT: namaDepan + namaBelakang + 5 random digits + @yopmail.com
      const { namaDepan, namaBelakang } = this.generateRandomName();
      
      // Generate 5 random digits
      let randomDigits = '';
      for (let i = 0; i < 5; i++) {
        randomDigits += Math.floor(Math.random() * 10);
      }
      
      // Combine: namaDepan + namaBelakang + digits + domain
      const email = `${namaDepan}${namaBelakang}${randomDigits}@yopmail.com`;
      
      return { email, namaDepan, namaBelakang };
    }
  
    static generateRandomNPWP() {
      // Generate valid Indonesian NPWP format: XX.XXX.XXX.X-XXX.XXX
      const seq1 = Math.floor(Math.random() * 98 + 1).toString().padStart(2, '0');
      const seq2 = Math.floor(Math.random() * 999 + 1).toString().padStart(3, '0');
      const seq3 = Math.floor(Math.random() * 999 + 1).toString().padStart(3, '0');
      const check = Math.floor(Math.random() * 10);
      const office = Math.floor(Math.random() * 999 + 1).toString().padStart(3, '0');
      const additional = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      return `${seq1}.${seq2}.${seq3}.${check}-${office}.${additional}`;
    }
  
    static generateRandomNPWPDigitsOnly() {
      let npwp = "";
      npwp += Math.floor(Math.random() * 9 + 1);
      
      for (let i = 0; i < 14; i++) {
        npwp += Math.floor(Math.random() * 10);
      }
      
      return npwp;
    }
  
    static generateRandomPhoneNumber() {
      const prefixes = [
        '0811', '0812', '0813', '0814', '0815', '0816', '0817', '0818', '0819',
        '0821', '0822', '0823', '0824', '0825', '0826', '0827', '0828',
        '0831', '0832', '0833', '0838',
        '0851', '0852', '0853', '0858',
        '0855', '0856', '0857', '0858',
        '0877', '0878',
        '0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889',
        '0895', '0896', '0897', '0898', '0899'
      ];
      
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const remainingDigits = Math.floor(Math.random() * 4) + 6;
      let suffix = "";
      
      for (let i = 0; i < remainingDigits; i++) {
        suffix += Math.floor(Math.random() * 10);
      }
      
      const phoneNumber = prefix + suffix;
      
      if (phoneNumber.length < 10) {
        return this.generateRandomPhoneNumber();
      }
      
      return phoneNumber;
    }
  
    static generateRandomCompanyPhone() {
      const areaCodes = ['021', '022', '024', '025', '031', '0274', '0341', '0361'];
      const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
      const digitCount = areaCode.length === 4 ? 7 : 8;
      let suffix = "";
      
      for (let i = 0; i < digitCount; i++) {
        suffix += Math.floor(Math.random() * 10);
      }
      
      return areaCode + suffix;
    }
  
    static generateRandomRekening() {
      let rekening = Math.floor(Math.random() * 9 + 1).toString();
      
      for (let i = 0; i < 11; i++) {
        rekening += Math.floor(Math.random() * 10);
      }
      
      return rekening;
    }
  
    static generateTestData(useFormattedNPWP = true) {
      // Generate email first to get consistent names
      const { email, namaDepan, namaBelakang } = this.generateRandomEmail();
      
      const nomorKTP = this.generateRandomKTP();
      
      // Generate NPWP in both formats
      const nomorNpwpFormatted = this.generateRandomNPWP();
      const nomorNpwpDigits = this.generateRandomNPWPDigitsOnly();
      
      // Generate phone numbers
      const nomorTelepon = this.generateRandomPhoneNumber();
      const nomorTeleponPerusahaan = this.generateRandomCompanyPhone();
      
      const nomorRekening = this.generateRandomRekening();
      const namaPemilikRekening = `${namaDepan.charAt(0).toUpperCase() + namaDepan.slice(1)} ${namaBelakang.charAt(0).toUpperCase() + namaBelakang.slice(1)}`;
  
      const data = {
        namaDepan: namaDepan.charAt(0).toUpperCase() + namaDepan.slice(1), // Capitalize first letter
        namaBelakang: namaBelakang.charAt(0).toUpperCase() + namaBelakang.slice(1), // Capitalize first letter
        nomorKTP,
        email, // New format: ahmadsantoso12345@yopmail.com
        nomorNpwp: useFormattedNPWP ? nomorNpwpFormatted : nomorNpwpDigits,
        nomorNpwpFormatted,
        nomorNpwpDigits,
        nomorTelepon,
        nomorTeleponPerusahaan,
        nomorRekening,
        namaPemilikRekening,
        // Add password for login
        password: "TestPassword123!"
      };
      
      console.log('DataGenerator: Generated test data with new email format', {
        email: data.email,
        emailFormat: 'namaDepan + namaBelakang + 5digits + @yopmail.com',
        namaDepan: data.namaDepan,
        namaBelakang: data.namaBelakang
      });
      
      return data;
    }
  
    // Generate data specifically for login (simpler)
    static generateLoginData() {
      const { email, namaDepan, namaBelakang } = this.generateRandomEmail();
      
      return {
        email,
        password: "TestPassword123!",
        namaDepan: namaDepan.charAt(0).toUpperCase() + namaDepan.slice(1),
        namaBelakang: namaBelakang.charAt(0).toUpperCase() + namaBelakang.slice(1)
      };
    }
  
    // Utility methods remain the same
    static formatNPWP(npwpDigits) {
      if (npwpDigits.length !== 15) {
        throw new Error(`Invalid NPWP length: ${npwpDigits.length}. Expected 15 digits.`);
      }
      return npwpDigits.replace(/(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/, '$1.$2.$3.$4-$5.$6');
    }
  
    static unformatNPWP(formattedNPWP) {
      return formattedNPWP.replace(/[.-]/g, '');
    }
  
    static validatePhoneNumber(phoneNumber) {
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      
      if (digitsOnly.length < 10 || digitsOnly.length > 13) {
        return false;
      }
      
      if (!digitsOnly.startsWith('08') && !digitsOnly.startsWith('02') && !digitsOnly.startsWith('03')) {
        return false;
      }
      
      return true;
    }
  
    static formatPhoneNumber(phoneNumber, withSpaces = false) {
      if (!withSpaces) return phoneNumber;
      
      if (phoneNumber.startsWith('08')) {
        return phoneNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
      } else {
        if (phoneNumber.startsWith('0274') || phoneNumber.startsWith('0341') || phoneNumber.startsWith('0361')) {
          return phoneNumber.replace(/(\d{4})(\d{3,4})(\d{4})/, '$1-$2-$3');
        } else {
          return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
      }
    }
  }
  
  // Export for use in other files
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataGenerator;
  } else {
    window.DataGenerator = DataGenerator;
  }