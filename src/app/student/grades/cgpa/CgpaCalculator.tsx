'use client';
import React, { useState } from 'react';
import styles from './CgpaCalculator.module.css';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { AiOutlineEye } from 'react-icons/ai';
import { FiDownload } from 'react-icons/fi';
import { CgFileDocument } from 'react-icons/cg';

const CgpaCalculator = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className={styles.container}>
      <div className={styles.component}>

        <div className={styles.marksSheet}>
          No results announced yet
        </div>
      </div>
    </div>
  );
};

export default CgpaCalculator;
