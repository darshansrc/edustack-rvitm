import React from 'react';
import { Card, CardContent, Table, TableBody, TableCell, TableContainer, TableRow, List, ListItem, ListItemText, Skeleton, Typography } from '@mui/material';

function LoadingSkeleton() {
  return (
    <div>
      <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center',justifyContent: 'center', width: '90vw',maxWidth: '500px', overflow: 'hidden'}}>
          <Skeleton variant="rounded" width={400} height={80} />
          <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Skeleton variant="text" width={150} height={20} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={150} height={20} />
              </TableCell>
            </TableRow>
            {/* You can add more table rows here with skeleton content */}
          </TableBody>
        </Table>
      </TableContainer>

      <List>
        <ListItem>
          <ListItemText>
            <Skeleton variant="text" width={150} height={20} />
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <Skeleton variant="text" width={150} height={20} />
          </ListItemText>
        </ListItem>
        {/* You can add more list items here with skeleton content */}
      </List>    
      </div>


    </div>
  );
}

export default LoadingSkeleton;
