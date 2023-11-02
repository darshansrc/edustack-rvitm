import getUser from '@/lib/getUser';
import React from 'react';

const user = async () => {
  const user = await getUser();
  return user;
}

export default user;