'use client';
import React from 'react'
import Navbar from '../components/navbar/Navbar'
import styles1 from '../components/navbar/Navbar.module.css'
import TopNavbar from '../components/topnavbar/TopNavbar'
import styles from './Course.module.css'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const page = () => {

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

  return (
    <>
    <TopNavbar name={'Course'}/>
    <Navbar/>
    <div className={styles.courseNavbar}>
          <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <StyledTabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <StyledTab label="Item One" {...a11yProps(0)} />
          <StyledTab label="Item Two" {...a11yProps(1)} />
          <StyledTab label="Item Three" {...a11yProps(2)} />
        </StyledTabs>
      </Box>

    </Box>
    </div>
        
    <div className={styles1.pageContainer} style={{paddingTop: '90px'}}>
    <CustomTabPanel value={value} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </div>
    </>
  )
}

export default page