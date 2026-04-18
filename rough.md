 # 1. UI Enhancements
- insert the mail icon from google material icons in the email input field.
- size:16px.
- position: Left side of the input field.
- spacing:8px between the icon and the input text.

- insert the lock icon from google material icons in the password input field
- size:16px.
- position: Left side of the input field.
- spacing:8px between the icon and the input text.

- insert the eye icon from google material icons in the password input field.
- size:16px.
- position: Right side of the input field.
- spacing:8px between the icon and the input text.
- toggle visibility: when a user clicks the eye icon on the right side of the password field:
  - the input type should switch between `password` and `text`.
  - the icon should toggle between `visibility` and `visibility_off` (the "eye" and "eye-off" states).


## 2. Authentication Logic & Error Messaging
- logic:trigger an error if a user attempts to sign in without an existing account in `fieldspec`.
- error message: "invalid email or password. If you don't have an account, please create one."
- placement: display this message directly above the sign-in button.


### 3. SMTP Service Configuration
- setup: configure SMTP for outgoing email services.
- feature: implement a password reset flow.
- action: registered users must receive an email containing a functional password reset link upon requesting a reset.