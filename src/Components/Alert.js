import { Alert } from "@mui/material";
import React from "react";

function AlertBox({ alert }) {
  return (
    <div>
      {alert.visible ? (
        <Alert severity={`${alert.type}`}>{alert.message}</Alert>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default AlertBox;
