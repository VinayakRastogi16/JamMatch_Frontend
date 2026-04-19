import { Guitar, Music2 } from "lucide-react";

const ChatSideBar = ({
  filteredMatches,
  activeRoom,
  search,
  setSearch,
  selectMatch,
  generateRoom,
  currentUser,
}) => {
  return (
    <div className="w-72 border-r border-border/50 bg-card/60 backdrop-blur-xl flex flex-col">
      <div className="px-5 py-5 border-b border-border/50">
        <h1 className="font-heading font-bold text-xl text-foreground">Messages</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Your matched musicians</p>
      </div>

      <div className="px-4 py-3">
        <input
          type="text"
          placeholder="Search Musician"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-secondary/50 border border-border/50 rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredMatches === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-6 text-center">
            <Music2 className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">
              {search ? "No musicians found" : "No matches yet. Start swiping!"}
            </p>
          </div>
        )}

        {filteredMatches.map((user) => {
          const room = generateRoom(currentUser.id, user.id);
          const isActive = room === activeRoom;
          return (
            <button
            key={user.id}
            onClick={()=>selectMatch(user)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all hover:bg-secondary/50 ${
                isActive? "bg-primary/10 border-r-2 border-primary" :""
                }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/30 flex items-center justify-center shrink-0">
                <span className="font-heading font-bold text-primary text-sm">{user.name?.[0]?.toUpperCase()}</span>
              </div>

              <div className="flex-1 text-left overflow-hidden">
                <p className="font-heading font-semibold text-sm text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-forground truncate flex items-center gap-1">
                  <Guitar className="w-3 h-3" />
                  {user.instrument?.[0] || "Musician"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSideBar
