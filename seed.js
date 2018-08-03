const db = require("./models");

db.sync().then(() => { return db.seed()})
         .then(() => {
            console.log("Database Synced");
          })
          .catch((err) => {
            console.log("Error:");
            console.log(err);
          })
          .finally(() => {
              db.close();
          });
