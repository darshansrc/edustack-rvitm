import React, { useState } from 'react';
import styles from './InternalAssessment.module.css';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { AiOutlineEye } from 'react-icons/ai';
import { FiDownload } from 'react-icons/fi';
import { CgFileDocument } from 'react-icons/cg';

const InternalAssessment = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className={styles.container}>
      <div className={styles.component}>
        <div className={styles.testTab}>
          <div
            className={`${styles.tabDiv} ${activeTab === 1 ? styles.activeTab : ''}`}
            onClick={() => handleTabClick(1)}
          >
            CIE 1
          </div>
          <div
            className={`${styles.tabDiv} ${activeTab === 2 ? styles.activeTab : ''}`}
            onClick={() => handleTabClick(2)}
          >
            CIE 2
          </div>
          <div
            className={`${styles.tabDiv} ${activeTab === 3 ? styles.activeTab : ''}`}
            onClick={() => handleTabClick(3)}
          >
            CIE 3
          </div>
        </div>

        <div className={styles.downloadReport}>
            <div className={styles.downloadBody}>
                <div className={styles.CgFileDocument}>
                    <CgFileDocument/>
                </div>
                <div>
                    Progress Report
                </div>
            </div>

            <div className={styles.downloadBody}>
                <div className={styles.downloadButton}>
                    <AiOutlineEye/>
                </div>
                <div className={styles.downloadButton}>
                    <FiDownload/>
                </div>
            </div>


        </div>

        <div className={styles.marksSheet}>
          Not yet Released
        </div>
      </div>
    </div>
  );
};

export default InternalAssessment;
