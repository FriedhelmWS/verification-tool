import { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

const baseUrl = "http://localhost:3001/";

function App() {
  const [inputText, setInputText] = useState(false);
  const [issue, setIssue] = useState("");

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
          setIssue(response.data.issue);
        });
    });

    return () => {
      window.removeEventListener("paste", null);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="text-left whitespace-pre-wrap">{inputText}</div>
        <div className="text-left text-red-600 whitespace-pre-wrap">
          {issue}
        </div>
        <button
          className="bg-green-800"
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
      </header>
    </div>
  );
}

export default App;
