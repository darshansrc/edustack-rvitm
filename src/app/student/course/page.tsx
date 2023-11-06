'use client';
<<<<<<< HEAD
import React, {  useState } from 'react'
=======
import React from 'react'
>>>>>>> parent of c0edff6 (Merge branch 'main' of https://github.com/darshan-sr/edustack-rvitm)
import Navbar from '../components/navbar/Navbar'
import styles1 from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar'
import styles from './Course.module.css'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

<<<<<<< HEAD
interface StyledTabProps {
  label: string;
=======
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
>>>>>>> parent of c0edff6 (Merge branch 'main' of https://github.com/darshan-sr/edustack-rvitm)
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
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};


const page = () => {

<<<<<<< HEAD
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

=======
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
>>>>>>> parent of c0edff6 (Merge branch 'main' of https://github.com/darshan-sr/edustack-rvitm)


  return (
    <>
    <TopNavbar name={'Course'}/>
    <Navbar/>
    <div className={styles.courseNavbar}>
    <StyledTabs
        value={selectedTab}
        onChange={handleTabChange}
      >
        <StyledTab label="Tab 1" />
        <StyledTab label="Tab 2" />
        <StyledTab label="Tab 3" />
      </StyledTabs>

    </div>
        
    <div className={styles1.pageContainer} style={{paddingTop: '90px'}}>
    <TabPanel value={selectedTab} index={0}>
        <Typography variant="h6">Tab 1 Content</Typography>
        <Typography>
          This is the content for Tab 1. You can replace this with your actual content.
        </Typography>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Typography variant="h6">Tab 2 Content</Typography>
        <Typography>
          This is the content for Tab 2. You can replace this with your actual content.
        </Typography>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Typography variant="h6">Tab 3 Content</Typography>
        <Typography>
          This is the content for Tab 3. You can replace this with your actual content.
        </Typography>
      </TabPanel>


    </div>
    </>
  )
}

export default page