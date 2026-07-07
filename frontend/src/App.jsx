import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [instruction, setInstruction] = useState("");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a Word document first.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("instruction", instruction);

    try {
      const res = await axios.post(
        "http://localhost:5001/upload",
        formData,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = `fixed-${file.name}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage("Document downloaded successfully!");
    } catch (error) {
      setMessage("Upload failed.");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>DocFix AI</h1>
      <p>Upload your Word document and tell AI how to format it.</p>

      <input
        type="file"
        accept=".docx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <textarea
        placeholder="Example: Make this look professional and reduce spacing"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
      />

      <button onClick={handleUpload}>Fix Document</button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;