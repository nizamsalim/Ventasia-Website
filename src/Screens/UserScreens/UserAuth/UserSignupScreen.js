import React, { useContext, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Breadcrumbs,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from "@mui/icons-material/Check";

import { Link, useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import axios from "axios";
import AppContext from "../../../Contexts/AppContext";

function UserSignupScreen() {
  const styles = {
    linkStyle: {
      textDecoration: "none",
      color: "black",
    },
    textField: {
      width: { xs: "95%", md: "80%" },
      // width: "80%",
    },
    signupBox: {
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      backgroundColor: "rgba(202, 203, 204,0.1)",
      width: { xs: "100%", sm: "60%", md: "50%", lg: "40%" },
      marginTop: 2,
      borderRadius: 2,
    },
  };

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const { setSignupData, setUser, showAlert } = useContext(AppContext);

  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isPhone = (phoneInput) => {
    // eslint-disable-next-line no-useless-escape
    const re = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    return re.test(String(phoneInput));
  };

  const handleSubmit = (e) => {
    setIsLoading(true);
    setPhoneError("");
    setEmailError("");
    setUsernameError("");
    e.preventDefault();
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/auth/user/signup`;
      const data = {
        name,
        email,
        username,
        phone,
        password,
        userType: "user",
      };
      if (!phone) {
        // no otp verification required
        axios
          .post(url, data)
          .then(({ data, status }) => {
            setIsLoading(false);
            if (status === 200) {
              setUser(data.user);
              localStorage.setItem("authtoken", data.authToken);
              localStorage.setItem("user", JSON.stringify(data.user));
              navigate("/", { replace: true });
            }
          })
          .catch((err) => {
            setIsLoading(false);
            if (err.response) {
              const data = err.response.data;
              switch (data.error.field) {
                case "username":
                  setUsernameError(data.error.message);
                  break;
                case "email":
                  setEmailError(data.error.message);
                  break;
                case "phone":
                  setPhoneError(data.error.message);
                  break;
                default:
                  showAlert({
                    type: "error",
                    message: "Something went wrong",
                    visible: true,
                  });
                  break;
              }
            }
          });
      } else {
        if (!isPhone(phone)) {
          setPhoneError("Please enter a valid phone number");
          setIsLoading(false);
          return;
        }

        checkDataExists()
          .then(() => {})
          .catch((err) => {
            setSignupData(data);
            navigate("/auth/verify/otp", { replace: true });
          });
      }
    } catch (error) {
      setIsLoading(false);
      showAlert({
        type: "error",
        message: "Something went wrong",
        visible: true,
      });
    }
  };

  const checkDataExists = () => {
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/auth/user/checkdata`;
      return new Promise((resolve, reject) => {
        axios
          .post(url, {
            email,
            phone,
            username,
          })
          .then((response) => {
            if (response.data.userExists) {
              switch (response.data.field) {
                case "email":
                  setEmailError("Email already exists");
                  break;
                case "phone":
                  setPhoneError("Phone number already exists");
                  break;
                case "username":
                  setUsernameError("Username already taken");
                  break;
                default:
                  break;
              }
              resolve();
            } else {
              reject();
            }
          });
      });
    } catch (error) {
      showAlert({
        type: "error",
        message: "Something went wrong",
        visible: true,
      });
    }
  };

  return (
    <div>
      <Container>
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginTop: 2 }}>
          <Link to="/" mt={2} sx={styles.linkStyle}>
            Home
          </Link>
          <Typography color="text.primary">New account</Typography>
        </Breadcrumbs>
        <Grid container justifyContent={"center"}>
          <Box component="div" sx={styles.signupBox} mb={3}>
            <Grid container justifyContent={"center"}>
              <Typography variant="h5" mt={3} mb={3} sx={{ fontWeight: "700" }}>
                Create new account
              </Typography>
            </Grid>

            <Box onSubmit={handleSubmit} component="form">
              <Grid container spacing={3}>
                <Grid item lg={12} xs={12}>
                  <Grid container justifyContent={"center"}>
                    <TextField
                      required
                      label="Name"
                      variant="outlined"
                      // fullWidth
                      sx={styles.textField}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Grid item lg={12} xs={12}>
                  <Grid container justifyContent={"center"}>
                    <TextField
                      required
                      label="Username"
                      variant="outlined"
                      // fullWidth
                      sx={styles.textField}
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      error={usernameError ? true : false}
                      helperText={usernameError && usernameError}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={3} mt={1}>
                <Grid item lg={12} xs={12}>
                  <Grid container justifyContent={"center"}>
                    <TextField
                      required
                      label="Email"
                      variant="outlined"
                      // fullWidth
                      sx={styles.textField}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={emailError ? true : false}
                      helperText={emailError && emailError}
                    />
                  </Grid>
                </Grid>
                <Grid item lg={12} xs={12}>
                  <Grid container justifyContent={"center"}>
                    <TextField
                      error={phoneError ? true : false}
                      helperText={phoneError && phoneError}
                      label="Phone"
                      variant="outlined"
                      // fullWidth
                      sx={styles.textField}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container spacing={3} mt={1}>
                <Grid item lg={12} xs={12}>
                  <Grid container justifyContent={"center"}>
                    <FormControl sx={styles.textField} variant="outlined">
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <OutlinedInput
                        required
                        id="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <FormHelperText>
                        Password should atleast be 6 characters long
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item lg={12} xs={12}>
                  <Grid container justifyContent={"center"}>
                    <FormControl sx={styles.textField} variant="outlined">
                      <InputLabel htmlFor="confirmPassword">
                        Confirm Password
                      </InputLabel>
                      <OutlinedInput
                        required
                        id="confirmPassword"
                        label="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={12} xs={12}>
                <Grid container mt={3} justifyContent="center">
                  <LoadingButton
                    loading={isLoading}
                    loadingPosition="start"
                    variant="contained"
                    startIcon={<CheckIcon />}
                    color="success"
                    sx={{
                      borderRadius: "50px",
                      padding: "10px",
                      paddingLeft: "20px",
                      paddingRight: "20px",
                      marginBottom: 3,
                    }}
                    type="submit"
                    disabled={
                      password !== confirmPassword ||
                      password.length < 6 ||
                      !name ||
                      !username ||
                      !email
                    }
                  >
                    Create account
                  </LoadingButton>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Container>
    </div>
  );
}

export default UserSignupScreen;
