// Custom command for registration flow
Cypress.Commands.add('registerUser', (userData) => {
    cy.visit('/register');
    
    // Fill form with user data
    Object.keys(userData).forEach(key => {
      if (key !== 'password' && key !== 'confirmPassword') {
        cy.get(`[name="${key}"]`).type(userData[key]);
      }
    });
    
    // Handle password separately for security
    cy.get('[name="password"]').type(userData.password);
    cy.get('[name="confirmPassword"]').type(userData.confirmPassword);
    
    cy.get('button[type="submit"]').click();
  });
  
  // Custom command for file upload
  Cypress.Commands.add('uploadFile', (selector, fileName) => {
    cy.fixture(fileName).then(fileContent => {
      cy.get(selector).selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: fileName,
      });
    });
  });
  
  // Custom command to wait for API response
  Cypress.Commands.add('waitForRegistrationAPI', () => {
    cy.intercept('POST', '/api/register').as('registerAPI');
    cy.wait('@registerAPI').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
  });

  // cypress/support/e2e.js
// Import commands.js using ES2015 syntax:
import './commands'

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing tests on uncaught exceptions from the app
  if (err.message.includes('ResizeObserver loop limit exceeded') ||
      err.message.includes('Non-Error promise rejection captured') ||
      err.message.includes('Script error')) {
    return false;
  }
  return true;
});

// // Before each test hook
// beforeEach(() => {
//   // Clear cookies and local storage
//   cy.clearCookies();
//   cy.clearLocalStorage();
  
//   // Generate fresh test data for each test
//   cy.task('generateTestData').then((testData) => {
//     cy.wrap(testData).as('testData');
//     cy.log('Test data generated:', testData);
//   });
// });

// // After each test hook  
// afterEach(() => {
//   // Clean up if needed
//   cy.log('Test completed');
// });

// ---

Cypress.Commands.add('fillNPWP', (selector, npwpValue) => {
    
    cy.get(selector).then($field => {
      const placeholder = $field.attr('placeholder') || '';
      const maxLength = $field.attr('maxlength');
      const fieldType = $field.attr('type') || 'text';
      
      // Detect if field expects formatted input
      const expectsFormatted = placeholder.includes('.') || 
                             placeholder.includes('-') || 
                             maxLength === '18' ||
                             placeholder.includes('XX.XXX.XXX.X-XXX.XXX');
      
      let valueToType = npwpValue;
      
      if (expectsFormatted && !/[.-]/.test(npwpValue)) {
        // Field expects formatted input but we have digits only
        valueToType = cy.formatNPWP(npwpValue);
      } else if (!expectsFormatted && /[.-]/.test(npwpValue)) {
        // Field expects digits only but we have formatted input
        valueToType = npwpValue.replace(/[.-]/g, '');
      }
      
      cy.get(selector)
        .clear()
        .type(valueToType, { delay: 50, force: true });
      
      // Wait for auto-formatting if applicable
      cy.wait(500);
      
      // Verify input was accepted
      cy.get(selector).should('not.have.value', '');
      
      cy.log(`✅ NPWP filled successfully: ${valueToType}`);
    });
  });
  
  // Phone number specific commands
  Cypress.Commands.add('fillPhone', (selector, phoneValue) => {
    
    // Validate minimum length
    if (phoneValue.length < 10) {
      throw new Error(`Phone number too short: ${phoneValue}. Minimum 10 characters required.`);
    }
    
    cy.get(selector)
      .should('be.visible')
      .clear()
      .type(phoneValue, { 
        delay: 30,  // Slower typing for better reliability
        force: true 
      })
      .should('have.value', phoneValue);
    
    cy.log(`✅ Phone filled successfully: ${phoneValue}`);
  });
  
  // Validate Indonesian phone number format
  Cypress.Commands.add('validatePhoneNumber', (phoneNumber, type = 'mobile') => {
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // Check minimum length
    if (digitsOnly.length < 10) {
      throw new Error(`Phone number too short: ${phoneNumber} (${digitsOnly.length} digits)`);
    }
    
    // Check maximum length
    if (digitsOnly.length > 13) {
      throw new Error(`Phone number too long: ${phoneNumber} (${digitsOnly.length} digits)`);
    }
    
    if (type === 'mobile') {
      // Mobile should start with 08
      if (!phoneNumber.startsWith('08')) {
        throw new Error(`Invalid mobile format: ${phoneNumber}. Should start with 08`);
      }
      
      // Check full mobile format
      if (!phoneNumber.match(/^08\d{8,11}$/)) {
        cy.log(`⚠️  Warning: Mobile phone format may not be standard: ${phoneNumber}`);
      }
    } else if (type === 'landline') {
      // Landline should start with area code (02x, 03x, etc)
      if (!phoneNumber.match(/^0\d{2,3}\d{7,8}$/)) {
        cy.log(`⚠️  Warning: Landline format may not be standard: ${phoneNumber}`);
      }
    }
    
    cy.log(`✅ Phone number validation passed: ${phoneNumber} (${type})`);
    return cy.wrap(true);
  });
  
  // Generate Indonesian mobile phone number
  Cypress.Commands.add('generateMobilePhone', () => {
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
    const remainingDigits = Math.floor(Math.random() * 4) + 6; // 6-9 digits
    let suffix = "";
    
    for (let i = 0; i < remainingDigits; i++) {
      suffix += Math.floor(Math.random() * 10);
    }
    
    const phoneNumber = prefix + suffix;
    cy.log(`Generated mobile phone: ${phoneNumber} (${phoneNumber.length} chars)`);
    return cy.wrap(phoneNumber);
  });
  
  // Format NPWP digits to Indonesian standard
  Cypress.Commands.add('formatNPWP', (npwpDigits) => {
    if (npwpDigits.length !== 15) {
      throw new Error(`Invalid NPWP length: ${npwpDigits.length}. Expected 15 digits.`);
    }
    
    // Format: XX.XXX.XXX.X-XXX.XXX
    const formatted = npwpDigits.replace(/(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/, '$1.$2.$3.$4-$5.$6');
    cy.log(`Formatted NPWP: ${npwpDigits} → ${formatted}`);
    return cy.wrap(formatted);
  });
  
  // Remove NPWP formatting
  Cypress.Commands.add('unformatNPWP', (formattedNPWP) => {
    const digitsOnly = formattedNPWP.replace(/[.-]/g, '');
    cy.log(`Unformatted NPWP: ${formattedNPWP} → ${digitsOnly}`);
    return cy.wrap(digitsOnly);
  });
  
  // Validate NPWP format
  Cypress.Commands.add('validateNPWPFormat', (selector) => {
    cy.get(selector).then($input => {
      const value = $input.val();
      
      // Check if it's either formatted (XX.XXX.XXX.X-XXX.XXX) or digits only (15 digits)
      const isFormatted = /^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/.test(value);
      const isDigitsOnly = /^\d{15}$/.test(value);
      
      if (!isFormatted && !isDigitsOnly) {
        throw new Error(`Invalid NPWP format: ${value}. Expected XX.XXX.XXX.X-XXX.XXX or 15 digits.`);
      }
      
      cy.log(`✅ NPWP format is valid: ${value}`);
    });
  });
  
  // Format phone number with dashes (for display purposes)
  Cypress.Commands.add('formatPhoneDisplay', (phoneNumber) => {
    if (phoneNumber.startsWith('08')) {
      // Mobile format: 0812-3456-7890
      const formatted = phoneNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
      return cy.wrap(formatted);
    } else {
      // Landline format: 021-1234-5678 or 0274-123-4567
      if (phoneNumber.startsWith('0274') || phoneNumber.startsWith('0341') || phoneNumber.startsWith('0361')) {
        // 4-digit area code
        const formatted = phoneNumber.replace(/(\d{4})(\d{3,4})(\d{4})/, '$1-$2-$3');
        return cy.wrap(formatted);
      } else {
        // 3-digit area code
        const formatted = phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        return cy.wrap(formatted);
      }
    }
  });
  
  // Wait for element to be stable (useful for dynamic content)
  Cypress.Commands.add('waitForStable', (selector, timeout = 5000) => {
    cy.get(selector, { timeout }).should('be.visible');
    cy.wait(500); // Small wait for animations
    cy.get(selector).should('be.visible');
  });
  
  // Enhanced dropdown selection with retry
  Cypress.Commands.add('selectDropdownWithRetry', (triggerSelector, optionText, maxRetries = 3) => {
    const attemptSelection = (retryCount = 0) => {
      cy.get(triggerSelector).click();
      
      cy.get('body').then($body => {
        const optionExists = $body.find(`ul#multiselect-options li[role="option"]:contains("${optionText}")`).length > 0;
        
        if (optionExists) {
          cy.get(`ul#multiselect-options li[role="option"]:contains("${optionText}")`).click();
        } else if (retryCount < maxRetries) {
          cy.wait(1000);
          attemptSelection(retryCount + 1);
        } else {
          throw new Error(`Option "${optionText}" not found after ${maxRetries} retries`);
        }
      });
    };
    
    attemptSelection();
  });
  
  // Verify no error messages present
  Cypress.Commands.add('verifyNoErrors', () => {
    cy.get('body').should('not.contain', 'Error')
                  .should('not.contain', 'Failed')
                  .should('not.contain', 'Invalid')
                  .should('not.contain', 'Required')
                  .should('not.contain', 'too short')
                  .should('not.contain', 'invalid format');
  });
  
  // Wait for loading to complete
  Cypress.Commands.add('waitForLoadingComplete', () => {
    cy.get('.loading, .spinner, .loader', { timeout: 1000 }).should('not.exist');
    cy.get('[data-testid="loading"]', { timeout: 1000 }).should('not.exist');
  });
  
  // Debug command to log element attributes
  Cypress.Commands.add('debugElement', (selector) => {
    cy.get(selector).then($el => {
      const attributes = {};
      Array.from($el[0].attributes).forEach(attr => {
        attributes[attr.name] = attr.value;
      });
      
      cy.log('Element debug info:', {
        selector,
        tagName: $el[0].tagName,
        attributes,
        value: $el.val(),
        text: $el.text(),
        visible: $el.is(':visible'),
        length: $el.val() ? $el.val().length : 0
      });
    });
  });
  
  // Comprehensive validation command for registration form
  Cypress.Commands.add('validateRegistrationForm', () => {
    cy.log('🔍 Comprehensive form validation...');
    
    // Get test data for validation
    cy.get('@testData').then((data) => {
      // Validate phone numbers
      cy.validatePhoneNumber(data.nomorTelepon, 'mobile');
      cy.validatePhoneNumber(data.nomorTeleponPerusahaan, 'landline');
      
      // Validate NPWP
      expect(data.nomorNpwpFormatted).to.match(/^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/);
      expect(data.nomorNpwpDigits).to.match(/^\d{15}$/);
      
      // Validate other fields
      expect(data.namaDepan).to.not.be.empty;
      expect(data.namaBelakang).to.not.be.empty;
      expect(data.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(data.nomorKTP).to.match(/^\d{16}$/);
      expect(data.nomorRekening).to.match(/^\d{12}$/);
      
      cy.log('✅ Comprehensive validation passed');
    });
  });