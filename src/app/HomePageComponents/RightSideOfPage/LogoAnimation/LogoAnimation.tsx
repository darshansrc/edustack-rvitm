import styles from "./LogoAnimation.module.css";
import { motion } from "framer-motion";

interface LogoAnimationProps {
  scale: string;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({ scale }) => {
  return (
    <>
      <div className={styles.OuterLayer}>
        <div
          className={`${styles.blendingWrapper}  mt-5 mb-[-70px]`}
          style={{ transform: `scale(${scale})` }}
        >
          <motion.div
            className={styles.LogoShapeLayer3}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 0.5,
              type: "spring",
              bounce: 0.5,
              damping: 10,
            }}
          />
          <motion.div
            className={styles.LogoShapeLayer2}
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 0.5,
              type: "spring",
              bounce: 0.5,
              damping: 10,
            }}
          />
          <motion.div
            className={styles.LogoShapeLayer1}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 1,
              delay: 0.5,
              type: "spring",
              bounce: 0.5,
              damping: 10,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default LogoAnimation;
