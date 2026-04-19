# FieldSpec – Forms Specification (MVP)

## Overview

This document defines how forms must behave across FieldSpec.

It ensures:

* consistency
* predictable validation
* clear user feedback
* reusable form patterns

All forms in the product must follow these rules.

---

## 1. Core Principles

### 1.1 Consistency

Forms that serve similar purposes must look and behave the same.

### 1.2 Clarity

Users must always understand:

* what is required
* what is optional
* what went wrong
* what happens after submission

### 1.3 Simplicity

Forms should only ask for the minimum information needed.

---

## 2. Form Structure Rules

Each form must use this structure:

1. Form title
2. Short supporting description (optional)
3. Input fields
4. Inline validation / help text
5. Primary submit action
6. Secondary action if needed

---

## 3. Field Rules

### 3.1 Labels

* Every field must have a visible label
* Labels must be concise and clear

### 3.2 Required vs Optional

* Required fields must be clearly indicated
* Optional fields must be marked as optional

### 3.3 Placeholder Usage

* Placeholders may support the label
* Placeholders must not replace labels

---

## 4. Validation Rules

### 4.1 Validation Source

* Backend validation is mandatory
* Frontend validation is required for UX only
* All final validation must be enforced by API using Zod

### 4.2 Validation Timing

* Validate on submit by default
* Validate on blur for important fields where helpful
* Do not show errors before user interaction

### 4.3 Error Messages

* Errors must appear near the relevant field
* Errors must be short, clear, and human-readable

Examples:

* “Project name is required”
* “Enter a valid email address”
* “Password must be at least 8 characters”

---

## 5. Submission Rules

### 5.1 Submit Button

* Must clearly describe the action:

  * “Create Project”
  * “Log In”
  * “Reset Password”

### 5.2 Loading State

* On submit:

  * disable submit button
  * show loading state
  * prevent duplicate submission

### 5.3 Success State

* On success:

  * show confirmation OR redirect clearly
  * do not leave user wondering if action completed

---

## 6. Form Error Handling

### 6.1 Field Errors

* Show inline, near the field

### 6.2 Form-Level Errors

Use for:

* invalid credentials
* failed submission
* network problems

Examples:

* “Something went wrong. Please try again.”
* “Invalid email or password.”

### 6.3 Security-Sensitive Forms

For auth forms:

* never reveal whether an email exists in the system
* use generic responses where needed

---

## 7. Input States

All fields must support these states:

* default
* focus
* filled
* error
* disabled

If applicable:

* success
* loading

---

## 8. Layout Rules

* Forms must use token-based spacing
* Related fields should be grouped logically
* Forms must remain readable on mobile and desktop
* Avoid overly wide form layouts

---

## 9. Accessibility Rules

* Every input must have an associated label
* Focus state must be visible
* Forms must be keyboard accessible
* Error messaging must be readable and clear

---

## 10. Auth Form Rules

### Signup

Fields:

* name
* email
* password

Behaviour:

* validate email format
* validate password length
* show success message after signup:

  * “Check your email to verify your account”

### Login

Fields:

* email
* password

Behaviour:

* generic error on failure
* redirect to dashboard on success

### Forgot Password

Fields:

* email

Behaviour:

* always show generic success state

### Reset Password

Fields:

* new password
* confirm password (recommended)

Behaviour:

* ensure passwords match
* redirect to login on success

---

## 11. Dashboard Form Rules

### Create Project

Fields:

* project name (required)
* company name (optional)

Behaviour:

* project name must be required
* show success by updating project list immediately

### Settings

Fields:

* name
* company name

Behaviour:

* save changes clearly
* show confirmation after update

---

## 12. Styling Rules

* Use design tokens for:

  * spacing
  * typography
  * colors
  * radius
  * elevation

* Tailwind may only be used for:

  * layout
  * flex/grid
  * responsiveness

---

## 13. Reusability Rules

All forms should follow shared patterns for:

* label placement
* field spacing
* validation messages
* submit button placement
* loading states

Avoid inventing a new form style for each page.

---

## 14. Anti-Patterns (Do Not Allow)

* No missing labels
* No validation only on the frontend
* No silent failures
* No multiple conflicting error messages
* No submit button remaining active during submission
* No placeholders used as labels

---
