'use client';
import { Box, Card, Skeleton, Typography } from '@mui/material';
import styles from './StudentAttendanceTable.module.css'
import { Tab as MyTab, Tabs as MyTabs, TabList as MyTabList, TabPanel as MyTabPanel } from 'react-tabs';

export default function Loading() {
    return (
        <>
  
        <div className={styles.contentContainer}>
  
        <div className={styles.container}>
  
            <div className={styles.attendanceCard}>
              { (
                <Skeleton variant="circular" width={120} height={120} />
              )}
             
              <div style={{ alignItems: 'center' }}>
              <h5 style={{ marginLeft: '10px', fontSize: '16px', marginBottom: '10px' ,width: '200px', maxWidth: '40%',whiteSpace: 'nowrap',fontFamily: 'Poppins',fontWeight: '500',color: '#111' }}>
                { (
                  <Skeleton variant="text" sx={{ fontSize: '1.3rem', width: '100%' }} />
                )}
                </h5>
               
                <p style={{ marginLeft: '10px', marginBottom: '0px', fontSize: '14px', color: '#333',fontWeight: '500' }}>
                  { (
                    <>
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    </>
                    
                  )}
                </p>
              </div>
            </div>
  
            <div>
            <h6 style={{ marginTop: '15px', marginLeft: '10px', color: 'grey', fontFamily: 'Poppins', fontWeight: '500',fontSize: '14px' }}>SUBJECTS </h6>
              <MyTabs style={{ marginTop: '10px' }}>
                <MyTabList style={{borderRadius: '10px', marginBottom: '15px'}}>
                  <MyTab style={{ width: '50%', textAlign: 'center' }}>Theory</MyTab>
                  <MyTab style={{ width: '50%', textAlign: 'center' }}>Lab</MyTab>
                </MyTabList>
  
                <MyTabPanel>
                <table className={styles.attendanceTable}>
                  <thead>
                    <tr >
                      <th className={styles.tableHead} style={{ borderTopLeftRadius: '10px' }}>
                        Subject 
                      </th>
                      <th className={styles.tableHead}>
                        Classes Held
                      </th>
                      <th className={styles.tableHead}>
                        Classes Attended
                      </th>
                      <th className={styles.tableHead} style={{ borderTopRightRadius: '10px',paddingRight: '10px' }}>
                        Attendance Percentage
                      </th>
                    </tr>
                  </thead>
                
                  <tbody>
                  {(
                      <tr>
                      <td className={styles.tableSubject}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      </td>
                      <td className={styles.tableData}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      </td>
                      <td className={styles.tableData}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      </td>
                      <td className={styles.tableData}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      </td>
                    </tr>
                    )}
                  </tbody>
                </table>
                </MyTabPanel>
                <MyTabPanel>
                <table className={styles.attendanceTable}>
                  <thead>
                    <tr>
                      <th className={styles.tableHead} style={{ borderTopLeftRadius: '10px' }}>
                        Subject
                      </th>
                      <th className={styles.tableHead}>
                        Classes Held
                      </th>
                      <th className={styles.tableHead}>
                        Classes Attended
                      </th>
                      <th className={styles.tableHead} style={{ borderTopRightRadius: '10px' }}>
                        Attendance Percentage
                      </th>
                    </tr>
                  </thead>
                
                  <tbody>
                  {(
                      <tr>
                      <td className={styles.tableSubject}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      </td>
                      <td className={styles.tableData}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      </td>
                      <td className={styles.tableData}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      </td>
                      <td className={styles.tableData}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                      </td>
                    </tr>
                    )}
                  </tbody>
                </table>
                </MyTabPanel>
              </MyTabs>
            </div>
  
            <h6 style={{ marginTop: '20px', marginBottom: '0px', marginLeft: '10px', color: 'grey', fontFamily: 'Poppins', fontWeight: '500',fontSize: '14px' }}>PREVIOUS CLASSES</h6>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              {(
                <Skeleton variant="text" sx={{ fontSize: '1rem', width: '300px', marginBottom: '5px'}}/>
              )}
            </Box>
            {(
              <Card
              style={{
                width: '100%',
                boxShadow: '0 0 0 1px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.04)',
                position: 'relative',
                marginTop: '12px',
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '10px'
              }}>
                <Typography>
                <Skeleton variant="text" sx={{ fontSize: '1.3rem', width: '90%'}}/>
                </Typography>
                <Typography>
                <Skeleton variant="text" sx={{ fontSize: '0.8rem', width: '80%'}}/>
                </Typography>
                <Typography>
                <Skeleton variant="text" sx={{ fontSize: '0.8rem', width: '80%'}}/>
                </Typography>
                <Typography>
                <Skeleton variant="text" sx={{ fontSize: '0.8rem', width: '80%'}}/>
                </Typography>
              </Card>
            )}
          </div>
        </div>
      </>
    );
}