import { useState } from 'react';
import axios from 'axios';

export default function Dashboard({token}){
  const [prompt,setPrompt]=useState('');
  const [type,setType]=useState('text');
  const [result,setResult]=useState('');

  const generate = async()=>{
    const res = await axios.post('http://localhost:5000/api/generate',{prompt,type},{headers:{Authorization:token}});
    setResult(res.data.result);
  }

  return (
    <div className="p-4">
      <input className="border p-2 w-full mb-2" placeholder="Enter prompt" value={prompt} onChange={e=>setPrompt(e.target.value)}/>
      <select value={type} onChange={e=>setType(e.target.value)} className="border p-2 mb-2">
        <option value="text">Text</option>
        <option value="image">Image</option>
      </select>
      <button className="bg-blue-500 text-white p-2 rounded" onClick={generate}>Generate</button>
      {result && (type==='text'?<p>{result}</p>:<img src={result} alt="AI"/>)}
    </div>
  );
}
