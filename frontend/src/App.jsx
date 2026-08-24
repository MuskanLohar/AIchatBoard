import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
const [response, setResponse] = useState("");


  const handleSend = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/ask-ai",
      {
        prompt: message,
      }
    );

    setResponse(response.data.answer);
    setMessage("");
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div>
      <h3>🤖 AI Chatbot</h3>

        <div>
        <h3>🤖 AI:</h3>
        <p>{response}</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;