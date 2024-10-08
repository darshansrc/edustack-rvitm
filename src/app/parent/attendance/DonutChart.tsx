
import React, { useEffect, useState } from 'react';


const DonutChart = ({ totalAttendancePercentage }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    setAnimatedPercentage(0);

    const animationDuration = 200; 
    const animationStep = (totalAttendancePercentage / animationDuration) * 10;

    let animationInterval: NodeJS.Timeout | null = null;

    const animate = () => {
      setAnimatedPercentage((prevPercentage) => {
        const newPercentage = prevPercentage + animationStep;
        return newPercentage < totalAttendancePercentage ? newPercentage : totalAttendancePercentage;
      });
    };

    animationInterval = setInterval(animate, 10);

    return () => {
      if (animationInterval !== null) {
        clearInterval(animationInterval);
      }
    };
  }, [totalAttendancePercentage]);

  const radius = 50; // Radius of the donut chart
  const circumference = 2 * Math.PI * radius; // Circumference of the donut chart
  const percentageFilled = (animatedPercentage / 100) * circumference; // Length of the filled portion

  let color = "#ccc"; 

  if (totalAttendancePercentage >= 75) {
    color = "green"; // Green if above 75%
  } else if (totalAttendancePercentage <= 50) {    
    color = "red"; // Red if below 50%
  } else if (totalAttendancePercentage > 50 && totalAttendancePercentage < 75) {
    color = "#ffc107"; // Red if below 50%
  } 

  
  const circleVariants = {
    initial: { strokeDasharray: '0 314' },
    animate: { strokeDasharray: `${percentageFilled} ${circumference}` }
  };

  return (
    <svg width="120" height="120">
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#ccc"
        strokeWidth="5"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${percentageFilled} ${circumference}`}
      />
      <text
        x="62"
        y="63"
        textAnchor="middle"
        dominantBaseline="middle"
        color='#333'
        style={{ fontSize: "22px", fontWeight: 'bold' }}
      >
    {totalAttendancePercentage ? `${Math.round(totalAttendancePercentage)}%` : '0%'}

      </text>
    </svg>
  );
};

export default DonutChart;
