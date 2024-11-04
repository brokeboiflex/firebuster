//#region imports
import admin from "firebase-admin";
import fs, { readFileSync } from "fs";
import path from "path";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import inquirer from "inquirer";

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
//#endregion
//#region firebase sdk init
const files = fs.readdirSync(path.join("service-keys"));
const jsonFile = files.find((file) => file.endsWith(".json"));

const serviceAccount = JSON.parse(
  readFileSync(new URL(path.join("./service-keys", jsonFile), import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
//#endregion
//#region functions
async function enableUser() {
  const answers = await inquirer.prompt({
    name: "email",
    type: "input",
    message: "Enter user's email address",
    prefix: "",
  });

  const email = answers.email;

  try {
    const user = await admin.auth().getUserByEmail(email);

    if (!user.disabled) {
      console.log(chalk.yellow("User enabled already!"));

      return;
    }
    const updatedUser = await admin
      .auth()
      .updateUser(user.uid, { disabled: false });
    console.log(chalk.green("User enabled"));
  } catch (err) {
    console.log(chalk.red(err));
  }
}
async function disableUser() {
  const answers = await inquirer.prompt({
    name: "email",
    type: "input",
    message: "Enter user's email address",
    prefix: "",
  });

  const email = answers.email;

  try {
    const user = await admin.auth().getUserByEmail(email);

    if (user.disabled) {
      console.log(chalk.yellow("User disabled already!"));
      return;
    }

    const updatedUser = await admin
      .auth()
      .updateUser(user.uid, { disabled: true });
    console.log(chalk.green("User disabled"));
  } catch (err) {
    console.log(chalk.red(err));
  }
}
async function approveUser() {
  const answers = await inquirer.prompt({
    name: "email",
    type: "input",
    message: "Enter user's email address",
    prefix: "",
  });

  const email = answers.email;

  try {
    const user = await admin.auth().getUserByEmail(email);

    if (user.photoURL === "https://this-site-doesnt-exist.com/approved") {
      console.log(chalk.yellow("User approved already!"));
      return;
    }

    const updatedUser = await admin.auth().updateUser(user.uid, {
      photoURL: "https://this-site-doesnt-exist.com/approved",
    });
    console.log(chalk.green("User approved"));
  } catch (err) {
    console.log(chalk.red(err));
  }
}
async function getUserByEmail() {
  const answers = await inquirer.prompt({
    name: "email",
    type: "input",
    message: "Enter user's email address",
    prefix: "",
  });
  const email = answers.email;
  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log(user);
  } catch (err) {
    console.log(chalk.red(err));
  }
}
//#endregion
//#region ui
let appLoaded = false;
let lastFrame;
async function welcome() {
  const logo = `
  █████▒██▓ ██▀███  ▓█████  ▄▄▄▄    █    ██   ██████ ▄▄▄█████▓▓█████  ██▀███  
▓██   ▒▓██▒▓██ ▒ ██▒▓█   ▀ ▓█████▄  ██  ▓██▒▒██    ▒ ▓  ██▒ ▓▒▓█   ▀ ▓██ ▒ ██▒
▒████ ░▒██▒▓██ ░▄█ ▒▒███   ▒██▒ ▄██▓██  ▒██░░ ▓██▄   ▒ ▓██░ ▒░▒███   ▓██ ░▄█ ▒
░▓█▒  ░░██░▒██▀▀█▄  ▒▓█  ▄ ▒██░█▀  ▓▓█  ░██░  ▒   ██▒░ ▓██▓ ░ ▒▓█  ▄ ▒██▀▀█▄  
░▒█░   ░██░░██▓ ▒██▒░▒████▒░▓█  ▀█▓▒▒█████▓ ▒██████▒▒  ▒██▒ ░ ░▒████▒░██▓ ▒██▒
 ▒ ░   ░▓  ░ ▒▓ ░▒▓░░░ ▒░ ░░▒▓███▀▒░▒▓▒ ▒ ▒ ▒ ▒▓▒ ▒ ░  ▒ ░░   ░░ ▒░ ░░ ▒▓ ░▒▓░
 ░      ▒ ░  ░▒ ░ ▒░ ░ ░  ░▒░▒   ░ ░░▒░ ░ ░ ░ ░▒  ░ ░    ░     ░ ░  ░  ░▒ ░ ▒░
 ░ ░    ▒ ░  ░░   ░    ░    ░    ░  ░░░ ░ ░ ░  ░  ░    ░         ░     ░░   ░ 
        ░     ░        ░  ░ ░         ░           ░              ░  ░   ░     
                                 ░                                            
`;
  console.clear();

  if (!appLoaded) {
    const logoAnim = chalkAnimation["rainbow"](logo);

    await sleep(1000);
    appLoaded = true;

    logoAnim.stop();

    lastFrame = logoAnim.frame();
  } else {
    console.log(lastFrame);
  }

  console.log("");
  console.log(chalk.gray("A firebase admin utility made by brokeboiflex"));
  console.log("");
}

async function menu() {
  const answers = await inquirer.prompt({
    name: "options",
    message: "What do you want to do?",
    prefix: "",
    type: "list",
    choices: [
      "Get user by email",
      new inquirer.Separator(),
      "Enable user",
      "Disable user",
      new inquirer.Separator(),
      "Workaround: Approve user with photoURL",
      new inquirer.Separator(),
      "Exit",
    ],
  });

  switch (answers.options) {
    case "Get user by email":
      await getUserByEmail();
      break;
    case "Enable user":
      await enableUser();
      break;
    case "Workaround: Approve user with photoURL":
      await approveUser();
      break;
    case "Disable user":
      await disableUser();
      break;
    case "Exit":
      console.clear();
      process.exit(0);
  }
}

async function payload() {
  let running = true;
  await welcome();
  while (running) {
    await menu();
  }
}
payload();
