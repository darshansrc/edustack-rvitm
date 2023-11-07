'use client';
import React, {  useState } from 'react'
import Navbar from '../components/navbar/Navbar'
import styles1 from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar'
import styles from '../course/Course.module.css'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import InternalAssessment from './internal-assessment/InternalAssessment';
import CgpaCalculator from './cgpa/CgpaCalculator';

interface StyledTabProps {
  label: string;
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    variant="fullWidth"
    scrollButtons="auto"
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    width: '100%',
    backgroundColor: 'rgb(29 78 216)',
  },
  width: '100%',
})


const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontFamily: 'Poppins',
  fontWeight: '400',
  fontSize: theme.typography.pxToRem(14),
  color: '#666666',
  '&.Mui-selected': {
    color: 'rgb(29 78 216)',
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#666666',
  },
}));

const TabPanel = ({ value, index, children }) => {
  return (
    <div hidden={value !== index}>
      {value === index && children}
    </div>
  );
};


const Page = () => {

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };



  return (
    <>
    <TopNavbar name={'Grades'}/>
    <Navbar/>
    <div className={styles.courseNavbar}>
    <StyledTabs
        value={selectedTab}
        onChange={handleTabChange}
      >
        <StyledTab label="IA Marks" />
        <StyledTab label="SEE & CGPA" />
      </StyledTabs>

    </div>
        
    <div className={styles1.pageContainer} style={{paddingTop: '110px'}}>
    <TabPanel value={selectedTab} index={0}>
        <InternalAssessment/>

      </TabPanel>

      <TabPanel value={selectedTab} index={1}>

        <CgpaCalculator/> 

      </TabPanel>




    </div>
    </>
  )
}

export default Page