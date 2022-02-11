import { LoadingButton } from "@mui/lab";
import {
  Box,
  Breadcrumbs,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { Check, Visibility, VisibilityOff } from "@mui/icons-material";
import AppContext from "../../../Contexts/AppContext";
import AlertBox from "../../../Components/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserLoginScreen() {
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
      justifyContent: "center",
    },
  };

  const { showAlert, alert, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [fieldError, setFieldError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [field, setField] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldError("");
    setPasswordError("");
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/auth/user/login`;
      const loginData = {
        field: field,
        password: password,
      };
      axios
        .post(url, loginData)
        .then((response) => {
          const data = response.data;
          setUser(data.user);
          localStorage.setItem("authtoken", data.authToken);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/", { replace: true });
        })
        .catch((err) => {
          const data = err.response.data;
          switch (data.error.field) {
            case "field":
              setFieldError(data.error.message);
              break;
            case "password":
              setPasswordError(data.error.message);
              break;
            default:
              break;
          }
        });
    } catch (error) {
      console.log(error);
      showAlert({
        type: "error",
        message: "Something went wrong",
        visible: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Container>
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginTop: 2 }}>
          <Link to="/" mt={2} sx={styles.linkStyle}>
            Home
          </Link>
          <Typography color="text.primary">Login</Typography>
        </Breadcrumbs>
        <Grid container justifyContent={"center"}>
          <Box component="div" sx={styles.signupBox} mb={3}>
            <AlertBox alert={alert} />
            <Grid container justifyContent={"center"}>
              <Typography variant="h5" mt={3} mb={3} sx={{ fontWeight: "700" }}>
                Login
              </Typography>
            </Grid>

            <Box onSubmit={handleSubmit} component="form">
              <Grid container spacing={3}>
                <Grid item lg={12} xs={12}>
                  <Grid container justifyContent={"center"}>
                    <TextField
                      required
                      label="Username/email"
                      variant="outlined"
                      error={fieldError ? true : false}
                      helperText={fieldError && fieldError}
                      sx={styles.textField}
                      type="text"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Grid item lg={12} xs={12}>
                  <Grid container justifyContent={"center"}>
                    <FormControl sx={styles.textField} variant="outlined">
                      <InputLabel htmlFor="Password">Password</InputLabel>
                      <OutlinedInput
                        required
                        id="Password"
                        label="Password"
                        error={passwordError ? true : false}
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
                      {passwordError && (
                        <FormHelperText sx={{ color: "red" }}>
                          {" "}
                          {passwordError}{" "}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item lg={12} xs={12}>
                  <Grid container mt={1} justifyContent="center">
                    {/* isLoading && <CircleLoader loading={isLoading} />*/}
                    <LoadingButton
                      loading={isLoading}
                      loadingPosition="start"
                      startIcon={<Check />}
                      variant="contained"
                      color="success"
                      sx={{
                        borderRadius: "50px",
                        padding: "10px",
                        paddingLeft: "30px",
                        paddingRight: "40px",
                        marginBottom: 3,
                      }}
                      type="submit"
                      disabled={password.length < 6 || !field}
                    >
                      Login
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Container>
    </div>
  );
}

export default UserLoginScreen;
