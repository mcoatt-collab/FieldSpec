remove the title form descrption +

reduced the padding of the button to 16px top and bottom and 24px left and right +

create a populated state after the an input field has been filled. +

-make use of the error color when displaying error messages on the input field reference the design-tokens.css file for the error colors

-reduce the size of the form title to a mmoderate side in the typography system +

reduce the stroke of the input field when seleccted to 1px and add a subtle shadow to the outline to make it pop a bit. +

the title of the page in the head to login page 

diisplay of error message beneath the input field that has the error "this field can not be left empty" whenever the user clicks on an input field and leave the input field without entering any value in it. the error message should use the error color from the design-tokens.css file

remove the icon that suggest new password to user in the password input field

change the cursor behaviour on the continue with google button to pointer on hover. also add a subtle box shadow to the button on hover to make it pop a bit.+

the populated state should make use of the primary container color from the design-tokens.css file for the fill of the input field and change the text colour of the text in the input field to on primary container color +

# form state
when the user clicks the sign in button it should display a loading state only after they have filled in all the input fields and clicked the sign in button +

if the user leaves the password field empty and clicks the sign in button, an error message should be displayed beneath the password field that says "enter your password" this error should use the error color from the design-tokens.css file and the input border should also use the error color from the design-tokens.css file. + 

if the user leaves the email field empty and clicks the sign in button, an error message should be displayed beneath the email field that says "enter a valid email address" this error should use the error color from the design-tokens.css file and the input border should also use the error color from the design-tokens.css file

if the user enters an invalid email address and clicks the sign in button, an error message should be displayed beneath the email field that says "enter a valid email address" this error should use the error color from the design-tokens.css file and the input border should also use the error color from the design-tokens.css file.

the or along with the dividers should be at the middle of the continue with google button and the sign in button

add the forgot password link to the opposite side of the password label text

add a pressed state to the sign in button using the primary color 20 from the design system

add a hovered state to the sign in button and forgot password button. using the primary color 50 from the design system

# error states
- an error message should be displayed beneath the email input field saying enter your email address and the password input field should display an error message beneath it saying "enter your password" when the user clicks the sign in button and both the email field and the password field are empty. this error should use the error color from the design-tokens.css file and the input border should also use the error color from the design-tokens.css file

- when the user clicks on the sign in button and the password field is empty, an error message should be displayed beneath the password field that says "enter your password" this error should use the error color from the design-tokens.css file and the input border should also use the error color from the design-tokens.css file.

- when the user enter an email address, that does not end with "@gmail.com", or "@yahoo.com", or "@outlook.com", or "@hotmail.com", or "@icloud.com or a @company name.com format the email input field should display an error message beneath it saying "invalid email address" this error should use the error color from the design-tokens.css file and the input border should also use the error color from the design-tokens.css file.

when the user clicks on the email field does not input his detail leaves and click the password input field and error messages should be displayed beneath the email input field saying "enter your email address" this error should use the error color from the design-tokens.css file and the input border should also use the error color from the design-tokens.css file.

- if the user clicks on the password field and does not input his password and leaves the field to click on another input field an error message should be displayed beneath the password field that says "enter your password" this error should use the error color from the design-tokens.css file and the input border should also use the error color from the design-tokens.css file.


when the user clicks on the sign in button and both the email field and the password field are filled in and matches the database record, the button should change to a loading state

- when the user clicks the email field while displaying an error message the error message(invalid email or enter valid email) should disappear and the error color of the input border should also change to the primary color once the user start typing in the email field +