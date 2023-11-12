import './StudentCard.css';

export default function StudentCard(props) {
  const attendanceStatus = props.Present ? "present" : "absent";
  const slNo = Number(props.USN.toString().replace(/^0+/, '').slice(-3));
  return (
    <div className={`cardd ${attendanceStatus}`} onClick={props.toggle} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div >
          <h6 className="cardd__number">{slNo + '.'}</h6>
      </div>

        <img src='/None.jpg' className="w-[60px] h-[60px] rounded-[50%] align-left" alt="StudentImage" />
   
      <div className="cardd__content">
        <h2 className="text-[14px] font-[500] font-[Poppins]" style={{textTransform: 'capitalize'}}>{props.Name}</h2>
        <p className="text-[12px] text-[#333] font-[Poppins]">{props.USN.toString()}</p>
      </div>
      <div>
        {props.Present ? (
          <span className="text-white bg-[green] rounded-[50%] w-[25px] h-[25px] flex items-center justify-center">P</span>
        ) : (
          <span className="text-white bg-[red] rounded-[50%] w-[25px] h-[25px] flex items-center justify-center">A</span>
        )}
      </div>
    </div>
  );
} 
