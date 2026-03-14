import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {

const API = "https://ai-journal-backend-fdet.onrender.com";

const [text, setText] = useState("");
const [entries, setEntries] = useState([]);
const [analysis, setAnalysis] = useState(null);

const userId = "123";

const fetchEntries = async () => {
const res = await axios.get(`${API}/api/journal/${userId}`);
setEntries(res.data);
};

useEffect(() => {
fetchEntries();
}, []);

const saveEntry = async () => {
  try {
    await axios.post(`${API}/api/journal`, {
      userId: userId,
      text: text,
      ambience: "forest"
    });

    setText("");
    fetchEntries();
  } catch (error) {
    console.error("Save failed:", error);
  }
};

const analyzeEmotion = async () => {
const res = await axios.post(`${API}/api/journal/analyze`, {
text: text
});
setAnalysis(res.data);
};

return (
<div style={{padding:"40px", fontFamily:"Arial"}}>

<h1>AI Journal</h1>

<textarea
rows="4"
cols="50"
placeholder="Write your journal..."
value={text}
onChange={(e)=>setText(e.target.value)}
/>

<br/><br/>

<button onClick={saveEntry}>Save Entry</button>

<button onClick={analyzeEmotion} style={{marginLeft:"10px"}}>
Analyze Emotion
</button>

<br/><br/>

{analysis && (
<div>
<h3>Emotion Analysis</h3>
<p>Emotion: {analysis.emotion}</p>
<p>Keywords: {analysis.keywords.join(", ")}</p>
<p>Summary: {analysis.summary}</p>
</div>
)}

<h2>Previous Entries</h2>

<ul>
{entries.map((entry)=>(
<li key={entry._id}>{entry.text}</li>
))}
</ul>

</div>
);
}

export default App;