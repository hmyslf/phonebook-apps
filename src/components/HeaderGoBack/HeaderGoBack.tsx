/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box
} from "@mui/material";

import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


type HeaderGoBackProps = {
  child?: React.ReactNode
};


const HeaderGoBack = (props: HeaderGoBackProps) => {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Box
        sx={{ padding: '5px 0', display: "flex", justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', width: '100%' }}
      >
        <div>
          <IconButton
            aria-label="ArrowBackIcon"
            onClick={() => {
              navigate(-1)
            }}>
            <ArrowBackIcon style={{ fontSize: 18, color: '#000000' }} />
          </IconButton>
        </div>
        {
          props.child
        }
      </Box>
    </Fragment>
  );
};

export default HeaderGoBack;
