"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import styles1 from "../components/navbar/Navbar.module.css";
import TopNavbar from "../components/topnavbar/TopNavbar";
import styles from "./Course.module.css";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import ClassSchedule from "./schedule/ClassSchedule";
import CourseMaterial from "./material/CourseMaterial";
import AssignmentPage from "./assignment/AssignmentPage";

interface StyledTabProps {
  label: string;
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const Page = ({
  searchParams,
}: {
  searchParams: {
    tab: any;
  };
}) => {
  const StyledTabs = styled((props: StyledTabsProps) => (
    <Tabs
      {...props}
      variant={window.innerWidth > 768 ? "standard" : "fullWidth"}
      scrollButtons="auto"
      TabIndicatorProps={{
        children: <span className="MuiTabs-indicatorSpan" />,
      }}
    />
  ))({
    "& .MuiTabs-indicator": {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    "& .MuiTabs-indicatorSpan": {
      width: "100%",
      backgroundColor: "#0577fb",
    },
    width: "100%",
  });

  const StyledTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
  ))(({ theme }) => ({
    textTransform: "none",
    fontFamily: "Poppins",
    fontWeight: "400",
    fontSize: theme.typography.pxToRem(14),
    color: "#666666",
    "&.Mui-selected": {
      color: "#0577fb",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#666666",
    },
  }));

  const TabPanel = ({ value, index, children }) => {
    return <div hidden={value !== index}>{value === index && children}</div>;
  };

  const currentTab = parseInt(searchParams.tab);

  const [selectedTab, setSelectedTab] = useState(currentTab ? currentTab : 0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <TopNavbar name={"Course"} />

      <div className={styles.courseNavbar}>
        <div className={styles.desktopNav}>
          <StyledTabs value={selectedTab} onChange={handleTabChange}>
            <StyledTab label="Schedule" />
            <StyledTab label="Material" />
            <StyledTab label="Assignments" />
          </StyledTabs>
        </div>
      </div>

      <div className={styles1.pageContainer} style={{ paddingTop: "90px" }}>
        <TabPanel value={selectedTab} index={0}>
          <ClassSchedule />
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <CourseMaterial />
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <AssignmentPage />
        </TabPanel>
      </div>
    </>
  );
};

export default Page;
