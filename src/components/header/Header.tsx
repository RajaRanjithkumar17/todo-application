import { Button } from "antd";
import "./header.css"
import { clearAuthentication } from "../../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
    const location = useLocation();
    const ignoredRoutes = ["/login" ];
    
    if (ignoredRoutes.includes(location.pathname)) {
        return null;
    }

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () =>{
        localStorage.setItem("auth",'')
        navigate('/login')
        dispatch(clearAuthentication())
    }
  return (
    <div className="header flex justify-between w-full items-center">
      <div className="header-name text-left w-1/2">To Do</div>
      <div className="flex w-1/2 justify-end items-center">
        <p>Name</p>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default Header;
