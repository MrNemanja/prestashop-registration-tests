# Exploratory Testing Report

## 1. Overview

**Application:** PrestaShop Demo Store  
**URL:** https://demo.prestashop.com/  
**Testing type:** Exploratory testing  
**Scope:** Registration, login, form validation, and shopping cart behavior.

## 2. Areas Explored

The following areas were explored manually:

- Registration form validation, including a first name containing only whitespace.
- Form behavior after validation errors and preservation of previously entered values.
- Registration behavior when the Create Account button is clicked more than once.
- Login behavior using a newly registered account.
- Shopping cart behavior before and after logging in and out.

## 3. Observations

### Observation 1: Form behavior after validation errors

When the first name contained only whitespace, the page refreshed and the password field was cleared, while the other fields retained their values. When the email field was left empty, the form displayed a validation error and retained all entered values, including the password.

The form behaved differently depending on the validation scenario. No confirmed defect was identified.

### Observation 2: Repeated registration submission

Clicking Create Account a second time before the first registration attempt finished resulted in an "Email already in use" message. The account was subsequently used to log in successfully.

The account creation was successful, but the second submission did not provide feedback about the outcome of the initial attempt. Further investigation would be needed to determine whether this behavior represents a usability issue.

### Observation 3: Shopping cart behavior across authentication

Products and quantities added to the shopping cart as a guest remained in the cart after logging in. The cart appeared empty after logging out.

It was not possible to determine whether the cart being emptied after logout was intended behavior or a defect.

## 4. Findings Summary

No confirmed bugs were identified during this exploratory testing session. The observations above document the behavior encountered and may warrant further investigation if the expected application behavior can be clarified.