# lgq-uc-auction
Assesment Test for QA Position

Check versi:
node --version
npm --version
Installation
1. Clone Repository
2. git clone <repository-url>
cd LGQ-QA-ASSESSMENT
3. Install Dependencies
   npm install
4. Verify Installation
   npx cypress verify

   
Project Structure
LGQ-QA-ASSESSMENT/
├── .vscode/
│   └── settings.json                   # VS Code configuration
├── cypress/
│   ├── downloads/                      # Downloaded files during tests
│   ├── e2e/
│   │   └── features/                   # Feature files (.feature)
│   │       └── registration.feature
│   ├── fixtures/                       # Test data & files
│   │   ├── ktp.jpg                    # Sample KTP file for upload
│   │   └── testData.json              # Test data
│   └── support/
│       ├── pages/                     # Page Object Model
│       │   └── RegistrationPage.js
│       ├── step_definitions/          # Step definition files
│       │   └── registration_steps.js
│       ├── utils/                     # Utility functions
│       │   └── dataGenerator.js
│       ├── commands.js                # Custom commands
│       └── e2e.js                    # Support file
├── node_modules/                      # Dependencies
├── cypress.config.js                 # Cypress configuration
├── package-lock.json                 # Dependency lock file
└── package.json                      # Dependencies & scripts


5. Running Tests
   npx cypress open
