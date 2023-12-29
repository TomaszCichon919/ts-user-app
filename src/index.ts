import consola from "consola";
const inquirer = require("inquirer");

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Edit = "edit",
  Quit = "quit",
}

type InquirerAnswers = {
  action: Action;
};
const startApp = () => {
  inquirer
    .prompt([
      {
        name: "action",
        type: "input",
        message: "How can I help you?",
      },
    ])
    .then(async (answers: InquirerAnswers) => {
      switch (answers.action) {
        case Action.List:
          users.showAll();
          break;
        case Action.Add:
          const user = await inquirer.prompt([
            {
              name: "name",
              type: "input",
              message: "Enter name",
            },
            {
              name: "age",
              type: "number",
              message: "Enter age",
            },
          ]);
          users.add(user);
          break;
        case Action.Remove:
          const name = await inquirer.prompt([
            {
              name: "name",
              type: "input",
              message: "Enter name",
            },
          ]);
          users.remove(name.name);
          break;
        case Action.Edit:
          const userNameToEdit = await inquirer.prompt([
            {
              name: "name",
              type: "input",
              message: "Enter user name to edit:",
            },
          ]);
          await users.edit(userNameToEdit.name);
          startApp();
          return;
        case Action.Quit:
          Message.showColorized(MessageType.Info, "Bye bye!");
          return;
        default:
          Message.showColorized(MessageType.Error, "Command not found");
          break;
      }

      startApp();
    });
};

enum MessageType {
  Success = "success",
  Error = "error",
  Info = "info",
}

class Message {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  public show(): void {
    console.log(this.content);
  }

  public capitalize(): void {
    this.content =
      this.content.charAt(0).toUpperCase() +
      this.content.slice(1).toLowerCase();
  }

  public toUpperCase(): void {
    this.content = this.content.toUpperCase();
  }

  public toLowerCase(): void {
    this.content = this.content.toLowerCase();
  }

  public static showColorized(type: MessageType, text: string): void {
    switch (type) {
      case MessageType.Success:
        consola.success(text);
        break;
      case MessageType.Error:
        consola.error(text);
        break;
      case MessageType.Info:
        consola.info(text);
        break;
      default:
        consola.info(text);
        break;
    }
  }
}

interface User {
  name: string;
  age: number;
}

class UsersData {
  private data: User[] = [];

  public showAll(): void {
    if (this.data.length === 0) {
      Message.showColorized(MessageType.Info, "Users data");
      Message.showColorized(MessageType.Error, "No data...");
    } else {
      Message.showColorized(MessageType.Info, "Users data");
      console.table(this.data);
    }
  }

  public add(newUser: User): void {
    const isValidUser =
      newUser.age > 0 &&
      newUser.name.length > 0 &&
      typeof newUser.name === "string" &&
      typeof newUser.age === "number";

    if (isValidUser) {
      this.data.push(newUser);
      Message.showColorized(
        MessageType.Success,
        "User has been successfully added!"
      );
    } else {
      Message.showColorized(MessageType.Error, "Wrong data!");
    }
  }

  public remove(userName: string): void {
    const index = this.data.findIndex((user) => user.name === userName);

    if (index !== -1) {
      this.data.splice(index, 1);
      Message.showColorized(MessageType.Success, "User deleted!");
    } else {
      Message.showColorized(MessageType.Error, "User not found...");
    }
  }

  public edit(currentName: string): Promise<void> {
    return new Promise((resolve) => {
      const userIndex = this.data.findIndex(
        (user) => user.name === currentName
      );

      if (userIndex !== -1) {
        inquirer
          .prompt([
            {
              name: "newName",
              type: "input",
              message: `Enter new name for ${currentName}:`,
            },
            {
              name: "newAge",
              type: "number",
              message: "Enter new age:",
            },
          ])
          .then((answers: { newName: string; newAge: number }) => {
            const isValidUser =
              answers.newAge > 0 && answers.newName.length > 0;

            if (isValidUser) {
              this.data[userIndex].name = answers.newName;
              this.data[userIndex].age = answers.newAge;
              Message.showColorized(
                MessageType.Success,
                "User details updated successfully!"
              );
              resolve();
            } else {
              Message.showColorized(MessageType.Error, "Wrong data!");
              resolve();
            }
          });
      } else {
        Message.showColorized(MessageType.Error, "User not found...");
        resolve();
      }
    });
  }
}

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageType.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");

startApp();
