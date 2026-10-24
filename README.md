# PrestaShop Registration Form Tests

## Overview

This project contains automated end-to-end tests for the registration form of the PrestaShop demo store, implemented using Playwright and TypeScript.

The tests cover successful registration, required fields, input validation and error handling for invalid registration data.

## Technologies

- TypeScript
- Playwright Test
- Node.js
- npm

## Prerequisites

- Node.js and npm installed
- Git installed (for cloning the repository)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MrNemanja/prestashop-registration-tests.git
   cd prestashop-registration-tests
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install the Playwright browser required for testing:

   ```bash
   npx playwright install chromium
   ```

## Running Tests

Run the registration tests in Chromium:

```bash
npm test
```

To run the tests directly using Playwright:

```bash
npx playwright test tests/registration.spec.ts --project=chromium
```

## Test Coverage

The automated tests cover the following scenarios:

- Navigation to the registration form
- Submission of the form with all required fields empty
- Validation of individually required text fields
- Validation of required checkboxes
- Invalid email format validation
- Password length restrictions
- Password strength indicator validation
- Successful account registration
- Rejection of an already registered email address
- Invalid first name validation
- Invalid last name validation
- Invalid birthdate validation
- Successful registration with a valid birthdate

## Test Reports

The project uses Playwright's HTML reporter.

After running the tests, open the HTML report with:

```bash
npm run report
```

The report provides details about test results and any failures.

## Notes

- Tests run against the publicly available PrestaShop demo store.
- Test execution depends on the availability and responsiveness of the demo environment.
- Registration tests use generated email addresses where appropriate to reduce conflicts with existing accounts.
