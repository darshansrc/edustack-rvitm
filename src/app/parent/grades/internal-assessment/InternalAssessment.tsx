import React, { useState } from "react";
import styles from "./InternalAssessment.module.css";
import { HiOutlineDocumentText } from "react-icons/hi";
import { AiOutlineEye } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { CgFileDocument } from "react-icons/cg";
import { Button, message, Space } from "antd";

const InternalAssessment = () => {
  const [activeTab, setActiveTab] = useState(1);

  const [messageApi, contextHolder] = message.useMessage();

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "Not yet released",
    });
  };

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.component}>
          <div className={styles.testTab}>
            <div
              className={`${styles.tabDiv} ${
                activeTab === 1 ? styles.activeTab : ""
              }`}
              onClick={() => handleTabClick(1)}
            >
              CIE 1
            </div>
            <div
              className={`${styles.tabDiv} ${
                activeTab === 2 ? styles.activeTab : ""
              }`}
              onClick={() => handleTabClick(2)}
            >
              CIE 2
            </div>
          </div>

          <div className={styles.downloadReport}>
            <div className={styles.downloadBody}>
              <div className={styles.CgFileDocument}>
                <CgFileDocument />
              </div>
              <div>Progress Report</div>
            </div>

            <div className={styles.downloadBody}>
              <div className={styles.downloadButton} onClick={warning}>
                <AiOutlineEye />
              </div>
              <div className={styles.downloadButton} onClick={warning}>
                <FiDownload />
              </div>
            </div>
          </div>

          <div className={styles.marksSheet}>Not yet released</div>
        </div>
      </div>
    </>
  );
};

export default InternalAssessment;
