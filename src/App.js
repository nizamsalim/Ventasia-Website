import Navbar from "./Components/Navbar";
import "./App.css";
import { Route, Routes, useParams } from "react-router-dom";
import UserLoginScreen from "./Screens/UserScreens/UserAuth/UserLoginScreen";
import UserSignupScreen from "./Screens/UserScreens/UserAuth/UserSignupScreen";
import UserHomeScreen from "./Screens/UserScreens/UserHomeScreen";
import OtpVerificationScreen from "./Screens/UserScreens/UserAuth/OtpVerificationScreen";
import { useContext, useEffect } from "react";
import AppContext from "./Contexts/AppContext";
import { ProtectedContainer, AuthContainer } from "./Components/AuthContainer";
import { SpeedDial } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

function App() {
  const { setUser } = useContext(AppContext);
  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(JSON.parse(user));
  }, []);

  return (
    <div>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={
          <ArrowDropUpIcon
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          />
        }
      />
      <Navbar title={"VENTASIA"} />
      <Routes>
        <Route path="/" element={<UserHomeScreen />} />

        <Route path="products" element={<ProtectedContainer />}>
          <Route path=":productCategory" element={<ProductsScreen />} />
        </Route>

        <Route path="auth" element={<AuthContainer />}>
          <Route path="login">
            <Route path="user" element={<UserLoginScreen />} />
          </Route>
          <Route path="signup">
            <Route path="user" element={<UserSignupScreen />} />
          </Route>
          <Route path="verify/otp" element={<OtpVerificationScreen />} />
        </Route>
      </Routes>
    </div>
  );
  // home screen is not inside auth container
  // but categories screens are inside auth container
  // <Route element={<AuthContainer />}>
  // <Route>
  //
}

function ProductsScreen() {
  const { productCategory } = useParams();
  return <div>Products screen - {productCategory}</div>;
}

export default App;
