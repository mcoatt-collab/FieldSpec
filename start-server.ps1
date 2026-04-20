cd C:\Users\uche\fieldspec_project\FieldSpec
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx next dev -p 3000" -WindowStyle Normal -Wait:$false