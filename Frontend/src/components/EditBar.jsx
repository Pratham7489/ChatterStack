import { useState, useRef, useEffect } from "react";
import useChatStore from "../store/useChatStore";
import { X, Check } from "lucide-react";

const EditBar = ({ message, onCancel }) => {
  const { sendMessage } = useChatStore();
  const [text, setText] = useState(message.text);
  const inputRef = useRef(null);

  // Auto-focus input when edit mode starts
  useEffect(() => {
      inputRef.current?.focus();
  }, []);

  const handleSave = async () => {
    // Agar text khali hai ya purana text hi hai, toh kuch mat karo bas band kar do
    if (!text.trim() || text === message.text) {
        onCancel(); 
        return;
    }

    const formData = new FormData();
    formData.append("text", text);
    formData.append("editMessageId", message._id); 

    await sendMessage(formData);
    onCancel();
  };

  const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleSave();
      }
  };

  return (
    <div className="flex flex-col bg-gray-900 border-t border-gray-700 w-full p-2 sticky bottom-0 z-10">
      
      {/* Top Banner indicating Edit Mode */}
      <div className="flex items-center justify-between px-4 py-1 text-sm text-indigo-400 font-medium mb-1">
         <span className="flex items-center gap-1 italic">✏️ Editing message...</span>
         <X 
           onClick={onCancel} 
           className="cursor-pointer hover:text-red-400 transition-colors" 
           size={18} 
         />
      </div>
      
      {/* Input Area */}
      <div className="flex items-center gap-2 px-2 pb-1">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-gray-700 text-white px-4 py-2 sm:py-3 rounded-full outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />

          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="bg-gradient-to-r from-indigo-500 to-pink-500 px-3 sm:px-5 py-2 sm:py-3 rounded-full shadow hover:scale-105 active:scale-95 transition-transform text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={20} strokeWidth={3} />
          </button>
      </div>
    </div>
  );
};

export default EditBar;