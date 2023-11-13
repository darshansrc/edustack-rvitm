// "use client";
import styles from "./LogoAnimation.module.css";
import { motion } from "framer-motion";

function LogoAnimation() {
  return (
    <>
      <div className={styles.OuterLayer}>
        <div className={`${styles.blendingWrapper} scale-150 max-md:scale-125`}>
          <motion.div
            className={styles.LogoShape2Layer1}
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
            className={styles.LogoShape2Layer2}
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
            className={styles.LogoShape2Layer3}
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
}

export default LogoAnimation;
