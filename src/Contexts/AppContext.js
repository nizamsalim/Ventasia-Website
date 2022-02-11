import { createContext, useState } from "react";

const AppContext = createContext();

export function AppContextWrapper({ children }) {
  const [signupData, setSignupData] = useSignupData({});
  const [user, setUser] = useUserData(null);
  const [alert, showAlert] = useAlert();
  return (
    <AppContext.Provider
      value={{ signupData, setSignupData, user, setUser, alert, showAlert }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;

const useSignupData = (defaultValue) => {
  const [signupData, setSignupData] = useState(defaultValue);
  return [signupData, setSignupData];
};

const useUserData = (defaultValue) => {
  const [user, setUser] = useState(defaultValue);
  return [user, setUser];
};

const useAlert = () => {
  let alertData = {
    type: "",
    message: "",
    visible: false,
  };
  const [alert, setAlert] = useState(alertData);
  const showAlert = ({ type, message }) => {
    setAlert({
      type: type,
      message: message,
      visible: true,
    });
    setTimeout(() => {
      setAlert({
        type: "",
        message: "",
        visible: false,
      });
    }, 4000);
  };
  return [alert, showAlert];
};
