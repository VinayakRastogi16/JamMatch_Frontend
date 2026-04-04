import { Button } from "./components/ui/button";



const Navbar = ()=>{

    const isSignedIn = ()=>{
        
    }

    return (
        <div className="fixed top-6 left-10 right-10 z-50 h-16 
                backdrop-blur-lg 
                border 
                bg-white/10
                rounded-xl shadow-lg 
                flex items-center justify-between px-6">

  <img
    src="/image.svg"
    className="h-[100px] mt-5 object-contain"
    alt="logo"
  />

  <button className="text-sm font-medium">
    <span>Sign</span> <span className="text-[#f68523]">Up</span>
  </button>

</div>
    );
}

export default Navbar;