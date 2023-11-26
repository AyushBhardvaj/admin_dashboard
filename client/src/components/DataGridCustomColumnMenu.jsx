import {
  GridColumnMenuContainer,
  GridColumnMenuFilterItem,
  GridColumnMenuHideItem,
} from "@mui/x-data-grid";
import React from "react";

const CustomColumnMenu = (props) => {
  const { hideMenu, colDef, open } = props;

  return (
    <GridColumnMenuContainer hideMenu={hideMenu} open={open} colDef={colDef}>
      <GridColumnMenuFilterItem onClick={hideMenu} colDef={colDef} />
      <GridColumnMenuHideItem onClick={hideMenu} colDef={colDef} />
    </GridColumnMenuContainer>
  );
};

export default CustomColumnMenu;
