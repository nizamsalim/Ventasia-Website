/* eslint-disable react-hooks/exhaustive-deps */
import { LoadingButton } from "@mui/lab";
import { Box, Container, Grid, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../../Contexts/AppContext";
import CheckIcon from "@mui/icons-material/Check";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../Components/Alert";

function OtpVerificationScreen() {
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
      marginTop: 5,
      borderRadius: 2,
    },
  };
  const { signupData } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const { setUser, alert, showAlert } = useContext(AppContext);
  const navigate = useNavigate();

  const serverUrl = process.env.REACT_APP_SERVER_SOCKET_URL;

  let socketRef;
  const socket = useRef(socketRef);

  useEffect(() => {
    socket.current = io(`${serverUrl}/signupverification`);
    socket.current.emit(
      "trigger otp request for signup verification",
      { phone: signupData.phone },
      (response) => {
        if (!response.success) {
          setError(response.error);
        }
      }
    );
    return () => {
      socket.current.emit("clear all existing otps");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const verificationData = {
        phone: signupData.phone,
        code: otp,
      };
      socket.current.emit("verify otp", verificationData, (response) => {
        if (response.success) {
          const url = `${process.env.REACT_APP_SERVER_URL}/auth/user/signup`;
          signupData.phoneToken = response.phoneToken;
          axios
            .post(url, signupData)
            .then(({ data }) => {
              setUser(data.user);
              localStorage.setItem("authtoken", data.authToken);
              localStorage.setItem("user", JSON.stringify(data.user));
              navigate("/", { replace: true });
            })
            .catch((err) => {
              const data = err.response.data;
              showAlert({
                type: "error",
                message: data.error.message,
                visible: true,
              });
            });
          //   POST to signup
        } else {
          setError(response.error);
        }
      });
    } catch (error) {
      showAlert({
        type: "error",
        message: "Something went wrong.",
        visible: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Container>
        <Grid container justifyContent={"center"}>
          <Box component="div" sx={styles.signupBox}>
            <AlertBox alert={alert} />
            <Box onSubmit={handleSubmit} component="form">
              <Grid container justifyContent={"center"}>
                <Typography
                  variant="h5"
                  mt={3}
                  mb={3}
                  sx={{ fontWeight: "700" }}
                >
                  Verify OTP
                </Typography>
              </Grid>
              <Grid container justifyContent={"center"} mb={2}>
                <Typography
                  variant="p"
                  sx={{
                    fontFamily: "helvetica",
                    fontSize: 14,
                    textAlign: "center",
                    padding: 1,
                  }}
                >
                  An OTP (One-time password) has been sent to{" "}
                  <strong>{signupData.phone}</strong>. Please enter the otp
                  within 5 minutes
                </Typography>
              </Grid>
              <Grid container spacing={3}>
                <Grid item lg={12} xs={12}>
                  <Grid container justifyContent={"center"}>
                    <TextField
                      label="One Time password"
                      variant="outlined"
                      error={error ? true : false}
                      helperText={error && error}
                      sx={styles.textField}
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid container mt={4} justifyContent="center">
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
                  disabled={otp.length < 6}
                >
                  Verify OTP
                </LoadingButton>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Container>
    </div>
  );
}

export default OtpVerificationScreen;
