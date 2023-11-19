import Link from "next/link";
import { GoPlus } from "react-icons/go";

function FloatingMarkAttendaceActionButton() {
  return (
    <>
      <Link href="/faculty/attendance/attendance-form" shallow={true}>
        <div className="md:hidden fixed bottom-[15svh] right-6 flex flex-col items-center justify-center text-center">
          <div
            className="rounded-full bg-[#0577fb] w-12 h-12 flex items-center justify-center m-1 transition duration-200"
            style={{
              boxShadow: "0px 3px 6px #00000029",
              cursor: "pointer",
            }}
          >
            <GoPlus
              size={25}
              style={{
                margin: "0 10px",
                backgorundColor: "#475569",
                color: "#fff",
              }}
            />
          </div>
          <div className="font-poppins text-xs">
            Mark <br /> Attendance
          </div>
        </div>
      </Link>
    </>
  );
}

export default FloatingMarkAttendaceActionButton;
