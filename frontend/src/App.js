import { useState, useEffect } from "react";
import axios from "axios";
import ReactDiffViewer from "react-diff-viewer";

import "./App.css";

const baseUrl = "http://localhost:3001/";

function App() {
  const [inputText, setInputText] = useState("");
  const [correctText, setCorrectText] = useState("");
  const [issue, setIssue] = useState("");

  const [fieldInput, setFieldInput] = useState("");

  useEffect(() => {
    window.addEventListener("paste", (e) => {
      const text = e.clipboardData.getData("text");
      setInputText(text);

      axios
        .post(
          baseUrl + "validate",
          { code: text },
          {
            headers: { "Access-Control-Allow-Origin": true },
          }
        )
        .then(function (response) {
          return axios.get(baseUrl + "docker", {
            headers: { "Access-Control-Allow-Origin": true },
          });
        })
        .then((response) => {
          if (response.data.error) {
            setIssue(response.data.error.toString());
          } else {
            setIssue(response.data.stdout);
          }
        });
    });

    return () => {
      window.removeEventListener("paste", null);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header text-start">
        <ReactDiffViewer
          className="text-black"
          oldValue={inputText}
          newValue={correctText}
          splitView={true}
        />
        <div className="text-left text-red-600 whitespace-pre-wrap">
          {issue}
        </div>

        <div className="flex gap-10">
          <button
            className="px-5 bg-green-600 rounded-full"
            onClick={() => {
              axios
                .post(
                  baseUrl + "correct",
                  { code: inputText, issue: issue },
                  {
                    headers: { "Access-Control-Allow-Origin": true },
                  }
                )
                .then(function (response) {
                  navigator.clipboard.writeText(response.data.prompt);
                });
            }}
          >
            Correct It
          </button>
          <button className="px-5 bg-blue-600 rounded-full">Reset</button>
        </div>
        <textarea
          className="text-black"
          rows={4}
          cols={40}
          onPaste={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            setFieldInput(e.target.value);
          }}
        />
      </header>
    </div>
  );
}

export default App;
