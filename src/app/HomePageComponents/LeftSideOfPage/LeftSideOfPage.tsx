import LogoAnimation from "./LogoAnimation/LogoAnimation";
import { motion } from "framer-motion";

const LeftSideOfPage = () => {
  return (
    <>
      <div className=" h-full w-1/2 flex flex-col justify-evenly items-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
          className="font-extrabold text-9xl text-blue-600"
          style={{
            WebkitTextStroke: "0.5px white",
            fontFamily: "poppins",
            marginBottom: "5px",
          }}
        >
          EduStack
        </motion.h1>
        <LogoAnimation />
      </div>
    </>
  );
};

export default LeftSideOfPage;
