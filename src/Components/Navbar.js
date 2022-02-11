import React, { useContext, useState } from "react";
import {
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  IconButton,
  Container,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AppContext from "../Contexts/AppContext";

function Navbar({ title }) {
  const styles = {
    iconStyle: {
      fontSize: 25,
    },
    linkStyle: {
      textDecoration: "none",
      color: "black",
    },
    navLinkStyle: {
      textDecoration: "none",
      color: "black",
      fontSize: 16,
      fontFamily: "helvetica",
    },
    title: {
      fontSize: 30,
      fontFamily: "helvetica",
      fontWeight: "700",
    },
  };

  const navigate = useNavigate();

  const { user, setUser } = useContext(AppContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const redirectToAuth = (destination) => {
    if (destination !== "") {
      if (destination === "/logout") {
        setUser(null);
        localStorage.removeItem("authtoken");
        localStorage.removeItem("user");
        setAnchorEl(null);
        return;
      }
      navigate(destination);
    }

    setAnchorEl(null);
  };

  return (
    <Box
      component="nav"
      // sx={{ position: "sticky", top: 0, backgroundColor: "white" }}
      mb={2}
    >
      <div className="upper">
        <Grid container sx={{ padding: 1 }}>
          {/* Title */}
          <Grid item xs={3}>
            <Grid container justifyContent="center">
              <Link to="/" style={styles.linkStyle}>
                <Typography sx={styles.title}> {title} </Typography>
              </Link>
            </Grid>
          </Grid>

          <Grid
            item
            sx={{
              display: { xs: "none", md: "flex" },
            }}
            justifyContent="center"
            alignItems="center"
            lg={6}
          >
            <Searchbar />
          </Grid>

          <Grid item lg={3}>
            <Grid container justifyContent={"space-evenly"}>
              <Link to="/orders" style={styles.linkStyle}>
                <IconButton>
                  <LocalOfferIcon sx={styles.iconStyle} />
                  <p style={{ fontSize: 18 }}>Orders</p>
                </IconButton>
              </Link>
              <Link to="/cart" style={styles.linkStyle}>
                <IconButton>
                  <ShoppingCartIcon sx={styles.iconStyle} />
                  <p style={{ fontSize: 18 }}>Cart</p>
                </IconButton>
              </Link>

              <IconButton onClick={handleClick}>
                <AccountCircleIcon sx={styles.iconStyle} />
                {user == null ? (
                  <p style={{ fontSize: 18, textDecoration: "none" }}>
                    Account
                  </p>
                ) : (
                  <p style={{ fontSize: 18, textDecoration: "none" }}>
                    <strong> {user.name} </strong>
                  </p>
                )}
              </IconButton>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => redirectToAuth("")}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {user == null ? (
                  <div>
                    <MenuItem
                      onClick={() => redirectToAuth("/auth/signup/user")}
                    >
                      Signup
                    </MenuItem>
                    <MenuItem
                      onClick={() => redirectToAuth("/auth/login/user")}
                    >
                      Login
                    </MenuItem>
                  </div>
                ) : (
                  <div>
                    <MenuItem onClick={() => redirectToAuth("/profile")}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => redirectToAuth("/logout")}>
                      <span style={{ color: "red" }}> Logout</span>
                    </MenuItem>
                  </div>
                )}
              </Menu>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <Divider />

      <Box component="div">
        <Container>
          <Grid container gap={4} justifyContent="center" sx={{ padding: 2 }}>
            <Link to="/" style={styles.navLinkStyle}>
              <Grid item>Home</Grid>
            </Link>
            <Link to="/products/technology" style={styles.navLinkStyle}>
              <Grid item>Technology</Grid>
            </Link>
            <Link to="/products/fashion" style={styles.navLinkStyle}>
              <Grid item>Fashion</Grid>
            </Link>
            <Link to="/products/accessories" style={styles.navLinkStyle}>
              <Grid item>Accessories</Grid>
            </Link>
            <Link to="/products/footwear" style={styles.navLinkStyle}>
              <Grid item>Footwear</Grid>
            </Link>
            <Link to="/products/sports" style={styles.navLinkStyle}>
              <Grid item>Sports</Grid>
            </Link>
            <Link to="/products/watches" style={styles.navLinkStyle}>
              <Grid item>Watches</Grid>
            </Link>
          </Grid>
        </Container>
      </Box>

      <Divider />
      <Outlet />
    </Box>
  );
}

export default Navbar;

// function BasicMenu() {
//   return (
//     <div>
//       <Button
//         id="basic-button"
//         aria-controls={open ? "basic-menu" : undefined}
//         aria-haspopup="true"
//         aria-expanded={open ? "true" : undefined}
//         onClick={handleClick}
//       >
//         Dashboard
//       </Button>
//       <Menu
//         id="basic-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         MenuListProps={{
//           "aria-labelledby": "basic-button",
//         }}
//       >
//         <MenuItem onClick={handleClose}>Profile</MenuItem>
//         <MenuItem onClick={handleClose}>My account</MenuItem>
//         <MenuItem onClick={handleClose}>Logout</MenuItem>
//       </Menu>
//     </div>
//   );
// }

function Searchbar() {
  return (
    <div>
      <Grid container justifyContent="center" alignContent="end">
        <TextField
          id="outlined-basic"
          variant="outlined"
          placeholder="Search the store"
          size="small"
          color="success"
          sx={{
            width: 350,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        />
        <Button
          variant="contained"
          color="success"
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            width: 120,
          }}
        >
          Search
        </Button>
      </Grid>
    </div>
  );
}
