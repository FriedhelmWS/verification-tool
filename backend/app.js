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

  res.status(200).send(
    JSON.stringify({
      msg: `created`,
    })
  );
});

app.post("/correct", (req, res) => {
  const code = req.body.code;
  const issue = req.body.issue;

  const prompt = `${code}\n This piece of code has the following issue(s): \n ${issue} \n Correct this and provides some explanations.`;

  res.set("Content-Type", "application/json");
  res.status(200).send(JSON.stringify({ prompt: prompt }));
});

app.get("/docker", (req, res) => {
  const { exec } = require("child_process");
  exec("infer run -- javac test.java", (err, stdout, stderr) => {
    if (err) {
      res.status(200).send(
        JSON.stringify({
          error: err.toString(),
        })
      );
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    res.set("Content-Type", "application/json");
    res.status(200).send(
      JSON.stringify({
        stdout: stdout,
        stderr: stderr,
      })
    );
  });
});
