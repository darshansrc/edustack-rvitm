import LogoAnimation from "./LogoAnimation/LogoAnimation";
import { motion } from "framer-motion";

const LeftSideOfPage = () => {
  return (
    <>
      <div className=" h-full w-1/2 flex flex-col justify-evenly items-center">
        <motion.div className="mb-[-30px]">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="font-extrabold text-9xl text-[#0577fb] font-poppins"
            style={{
              WebkitTextStroke: "0.5px white",
            }}
          >
            Edu
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
            className="font-extrabold text-9xl text-[#0577fb] font-poppins"
            style={{
              WebkitTextStroke: "0.5px white",
            }}
          >
            stack
          </motion.span>
        </motion.div>
        <LogoAnimation />
      </div>
    </>
  );
};

export default LeftSideOfPage;
