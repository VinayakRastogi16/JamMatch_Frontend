import { Check, CheckCheck } from "lucide-react";

const ChatMessage = ({ msg, isMe }) => {
  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm break-all overflow-hidden ${
          isMe
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card border border-border/50 text-foreground rounded-bl-sm"
        }`}
      >
        <p>{msg.text}</p>
        <p>
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {
          isMe &&(
            msg.read? <CheckCheck className="w-3 h-3 text-blue-600 float-end"/>:<Check className="w-3 h-3 float-end text-primary-foreground/60 "/>
          )
        }
      </div>
    </div>
  );
};

export default ChatMessage;
