import { Guitar, Send, Music2, Phone, Video } from "lucide-react";
import ChatMessage from "./ChatMessage.jsx";

const ChatWindow = ({
  activeUser,
  messages,
  input,
  setInput,
  sendMessage,
  handleKeyDown,
  bottomRef,
  currentUser,
  activeRoom,
  navigate,
}) => {
  return (
    <div className="flex flex-1 flex-col">

      
      <div className="flex items-center justify-between px-5 py-5 border-b border-border/50 bg-card/60 backdrop-grayscale">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/30 items-center flex justify-center">
            <span className="font-heading font-bold text-primary text-sm">{activeUser.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p className="font-heading font-semibold text-foreground text-sm">{activeUser.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Guitar className="w-3 h-3" />
              {activeUser.instrument?.[0]}
            </p>
          </div>
        </div>
        <div>
          <button onClick={()=>{
          navigate(`/jam/${activeRoom}`)
        }}
        className="px-4 py-2 rounded-full text-primary-foreground transition-all text-sm font-semibold font-heading hover:bg-primary/85 shadow-[var(--glow-primary)]"
        ><Phone/></button>

        <button onClick={()=>{
          navigate(`/jam/${activeRoom}`)
        }}
        className="px-4 py-2 rounded-full text-primary-foreground transition-all text-sm font-semibold font-heading hover:bg-primary/85 shadow-[var(--glow-primary)]"
        ><Video/></button>
        </div>
      </div>



      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Music2 className="w-8 h-8 opacity-30" />
            <p className="text-sm">No message yet. Say Hi!</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage
            key={msg._id}
            msg={msg}
            isMe={msg.senderId === currentUser.id}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 py-4 border-t border-border/50 bg-card/60 backdrop-blur-xl">
        <div className="flex items-center gap-3 bg-secondary/50 border border-border/50 rounded-full px-4 py-2">
         <input type="text" 
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
          />
          <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-8 h-8 rounded-full bg-primary/60 flex items-center justify-center disabled:opacity-40 transition-all hover:bg-primary/90"
          >
            <Send className="w-4 h-4 text-primary-foreground"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
