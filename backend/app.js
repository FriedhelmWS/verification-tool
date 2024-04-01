const express = require("express");
const fs = require("fs");
var cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});

app.post("/validate", (req, res) => {
  const code = req.body.code;
  const file = "test.java";

  fs.writeFileSync(file, code);

  res.set("Content-Type", "application/json");
  res.status(200).send(
    JSON.stringify({
      issue: `
        test.java:4: error: Null Dereference
        object \`s\` last assigned on line 3 could be null and is dereferenced at line 4.
        2.     int test() {
        4. >     return s.length();
        5.     }
        6.   }
    `,
    })
  );
});

app.post("/correct", (req, res) => {
  const code = req.body.code;
  const issue = req.body.issue;

  const prompt = `${code}\n This piece of code has the following issue(s): \n ${issue} \n Correct this.`;

  res.set("Content-Type", "application/json");
  res.status(200).send(JSON.stringify({ prompt: prompt }));
});
