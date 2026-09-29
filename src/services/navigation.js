let navigate;

const setNavigate = (nav)=>{
    navigate = nav;
}

const redirectTo = (path)=>{
    if(navigate){
        navigate(path);
    }
}

export {setNavigate, redirectTo};