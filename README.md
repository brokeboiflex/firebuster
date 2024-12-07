# Usage

1. Download dependencies using npm with `npm i`
2. Initialize Firebase Admin with Service Account
   Go to Firebase Console > Project Settings > Service accounts, and generate a new private key. Download the .json file and save it in `service-keys` folder.
3. Run the program using `npm start`

## Notifications

You can notify users about changes to their accounts by making changes to `config.json`. Currently only email nottifications are supported.
All you have to do is to fill `nodemailer_config` with your credentials, and change `enabled` property of the function you want to notify about. You can modify the `message` and `subject` as well.

If you're using 2FA you have to use [Application Specific](https://security.google.com/settings/security/apppasswords) password.

Keywords: `USER`; will be replaced with data from `UserRecord`.

# Todos

1. Flags: In the future the program will be runable with flags as well as prompts
2. Batch commands: Option to perform the same action for multiple accounts
