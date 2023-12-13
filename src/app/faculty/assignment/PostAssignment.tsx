"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "antd";
import { Select } from "antd";

const PostAssignment = () => {
  const [formStep, setFormStep] = useState<number>(1);
  const [classSubjectPairList, setClassSubjectPairList] = useState<any[]>([]);
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const { Option } = Select;

  useEffect(() => {
    const fetchClassSubjectPairs = async () => {
      try {
        const res = await fetch(
          `${window.location.origin}/api/faculty/attendance`,
          {}
        );
        const fetchedData = await res.json();
        setClassSubjectPairList(fetchedData?.classSubjectPairList || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClassSubjectPairs();
  }, []);

  const uniqueClassOptions = classSubjectPairList.reduce((acc, pair) => {
    if (!acc[pair.className]) {
      acc[pair.className] = [];
    }
    acc[pair.className].push(pair);
    return acc;
  }, {});

  const step1 = () => {
    return (
      <div className="flex items-center flex-col  justify-center w-full">
        <div className="flex flex-col items-center">
          <p className="text-left font-[Poppins] font-[500] text-[12px] mt-2 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
            Class
          </p>
          <Select
            value={selectedClassName || undefined}
            onChange={(value) => {
              setSelectedClassName(value);
              setSelectedSubject("");
            }}
            size="large"
            placeholder="Select Class"
            className="w-[85vw] max-w-[450px]"
          >
            {Object.keys(uniqueClassOptions).map((className, index) => (
              <Select.Option key={index} value={className}>
                {uniqueClassOptions[className][0].classSemester}SEM {className}
              </Select.Option>
            ))}
          </Select>

          {selectedClassName && (
            <>
              <p className="text-left font-[Poppins] font-[500] text-[12px] mt-6 pl-2 text-slate-600 w-[85vw] max-w-[450px]">
                Subject
              </p>
              <Select
                value={selectedSubject || undefined}
                onChange={(value) => setSelectedSubject(value)}
                placeholder="Select Subject"
                className="w-[85vw] max-w-[450px]"
                size="large"
              >
                {uniqueClassOptions[selectedClassName].map((pair, index) => (
                  <Select.Option key={index} value={pair.code}>
                    {pair.subjectName} ({pair.code})
                  </Select.Option>
                ))}
              </Select>
            </>
          )}
          <Button onClick={() => setFormStep(2)}>Next</Button>
        </div>
      </div>
    );
  };

  const step2 = () => {
    return (
      <div>
        <h1>Step 2</h1>
        <Button onClick={() => setFormStep(3)}>Next</Button>
      </div>
    );
  };

  const step3 = () => {
    return (
      <div>
        <h1>Step 3</h1>
        <Button onClick={() => setFormStep(1)}>Next</Button>
      </div>
    );
  };

  return (
    <div>
      {formStep === 1 && step1()}
      {formStep === 2 && step2()}
      {formStep === 3 && step3()}
    </div>
  );
};

export default PostAssignment;
