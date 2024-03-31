import { useState, useEffect } from "react";

import "./App.css";

function App() {
  const [inputText, setInputText] = useState(false);

  useEffect(() => {
    window.addEventListener("paste", (e) => {
      const text = e.clipboardData.getData("text");
      if (
        text.startsWith("private") ||
        text.startsWith("public") ||
        text.startsWith("class")
      )
        setInputText(text);
    });

    return () => {
      window.removeEventListener("paste", null);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="whitespace-pre-wrap text-left">{inputText}</div>
      </header>
    </div>
  );
}

export default App;
