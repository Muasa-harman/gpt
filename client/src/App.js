import { useState,useEffect } from 'react';
import './App.css';
import './normal.css';

function App() {

  useEffect(()=>{
    getEngines();
  },[])

  const [input,setInput] = useState("");
  const [models,setModels] = useState([]);
  const [currentModel,setCurrentModel] = useState([])
  const [chatLog,setChatLog] = useState([{
    user: "gpt",
    message:"How may i help you today please",
  },{
    user:"me",
  message:"Help me find a gis server,api and their keys"
  }])
  // clear chat
  const clearChats = () =>{
    setChatLog([])
  }

  const getEngines = () =>{
    fetch("http://localhost:5000/models").then(res => res.json()).then(data => console.log(data.models.data))
  }
  

  const handleSubmit = async(e) =>{
    e.preventDefault();
    let chatLogNew = [...chatLog,{user:"me",message: `${input}`}]
    await setInput("")
    setChatLog(chatLogNew)
    
    // fetch response to the api combined with the chat log input and sending it to the localhost 3001
    const messages = chatLogNew.map((message)=> message.message).join("\n")
    const response = await fetch("http://localhost:5000",{
      method:"POST",
      headers: {
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        message:messages
      })
    });
    const data = await response.json();
    await setChatLog([...chatLogNew,{user: "gpt", message: `${data.message}`}])
    // console.log(data.message)
  }
  return (
    <div className="App">
      <aside className='sidemenu'>
      <div className='side-menu-button' onClick={clearChats}>
        <span>+</span>
        New Chat
      </div>
      <div className='models'>
        <select>
          {models.map((model,id)=>(
            <option key={model.id} value={model.id}>{model.id}</option>
          ))}
        </select>
      </div>
      </aside>
      <section className='chatbox'>
        <div className='chat-log'>
          {chatLog.map((message,index)=>(<ChatMessage key={index} message={message}/>))}
        </div>
        <div className='chat-input-holder'>
          <form onSubmit={handleSubmit}>
          <input rows="1" value={input} onChange={(e)=>setInput(e.target.value)} className='chat-input-textarea'></input>
          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({message}) => {
  return (
       <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
              <div className='chat-message-center'>
                <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}></div>

                <div className='message'>
                  {message.message}
                </div>
              </div>
            </div>
  )
}
export default App;
