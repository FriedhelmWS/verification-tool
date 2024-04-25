import { useState, useEffect } from "react";
import axios from "axios";
import ReactDiffViewer from "react-diff-viewer";

import "./App.css";

const baseUrl = "http://localhost:3001/";

function App() {
  const [inputText, setInputText] = useState("");
  const [issue, setIssue] = useState("");

  const [fieldInput, setFieldInput] = useState("");

  useEffect(() => {
    window.addEventListener("paste", (e) => {
      // Add listener to paste event
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
        {inputText === "" && <>Paste Code Snippet to Start</>}
        <ReactDiffViewer
          className="text-black"
          oldValue={inputText}
          newValue={fieldInput}
          splitView={true}
        />
        <div className="text-left text-red-600 whitespace-pre-wrap">
          {issue}
        </div>
        {issue !== "" && !issue.includes("No issues found") && (
          <div>
            <div className="flex items-center justify-center gap-10 my-8">
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
                      // Get LLM promopt and copy to clipboard
                      navigator.clipboard.writeText(response.data.prompt);
                    });
                }}
              >
                Retrieve Prompt
              </button>
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
            <div>Paste Modified Code In the Box</div>
          </div>
        )}
        <button
          className="px-5 my-6 bg-blue-600 rounded-full"
          onClick={() => {
            setInputText("");
            setIssue("");
            setFieldInput("");
          }}
        >
          Reset
        </button>
      </header>
    </div>
  );
}

export default App;
