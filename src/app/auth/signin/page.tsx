'use client';
import Link from 'next/link';
import styles from './SignIn.module.css'
import { FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiOutlineMail , HiOutlineLockClosed} from 'react-icons/hi'
import { useState } from 'react';
import { MdArrowBackIosNew } from 'react-icons/md'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase-config';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
 
const SignIn = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = (e: any) => {
    e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Set loading state to true

    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then(async (res) => {
          const user = res.user;
          const getRef = doc(db , 'users' , user.uid);
          const userDoc = await getDoc(getRef);

          fetch("/api/auth", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${await res.user.getIdToken()}`,
            },
          }).then(async (response) => {
            if (response.status === 200) {
              try{
                if(userDoc.exists()){
                  const userData = userDoc.data();
                  if(userData.type === 'student'){           
                    router.push('/student/home');
                  }
                  else if(userData.type === 'faculty'){
                    router.push('/faculty/home');
                  }
                  else if(userData.type === 'parent'){
                    router.push('/parent/home');
                  }
                  else{
                    setError('No Records Found');
                    await signOut(auth);
                    setIsLoading(false);
                  }
                }
              } catch(err){
                setError('No Records Found')
                await signOut(auth);
                setIsLoading(false);

                
              }
            }
          })



        })
        .catch((error) => {
          setError(error.message);
          setIsLoading(false);
        });
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <main className={styles.pageContainer}>
      <nav className={styles.navBar}>
        <Link href="/">
          <MdArrowBackIosNew style={{ fontSize: '20px' }} />
        </Link>
      </nav>
      <div className={styles.formContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
          <img src="/logo.png" style={{ maxWidth: '60px', maxHeight: '60px', alignItems: 'center' }} />
          <h1 style={{ fontSize: '25px', padding: '10px' }}> | </h1>
          <img src="/logorv.png" style={{ maxWidth: '60px', maxHeight: '60px', alignItems: 'center' }} />
        </div>
        <div style={{ textAlign: 'center', margin: '25px' }}>
          <h1 style={{ fontWeight: '600', fontFamily: 'Poppins', fontSize: '1.5rem' }}>Welcome!</h1>
          <p style={{ color: '#030303', fontSize: '14px' }}>Please Sign In to your account to Continue</p>
        </div>
        <div className={styles.inputHeading}>Email Address</div>
        <div className={styles.inputContainer}>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className={styles.formInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Add the required attribute
          />
          <div className={styles.iconContainer}>
            <HiOutlineMail />
          </div>
        </div>
        <div className={styles.inputHeading}>Password</div>
        <div className={styles.inputContainer}>
          <input
            placeholder="Enter your password"
            className={styles.formInput}
            type={passwordShown ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // Add the required attribute
          />
          <span onClick={togglePasswordVisibility} className={styles.passwordButton}>
            {passwordShown ? <FiEye /> : <FiEyeOff />}
          </span>
          <div className={styles.iconContainer}>
            <HiOutlineLockClosed />
          </div>
        </div>
        <div className={styles.forgotPassword}>Forgot Password?</div>
        {error ? error : null}
        <button className={styles.primaryButton} onClick={handleSubmit} disabled={isLoading || !isFormValid}>
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>
        <p style={{ fontSize: '14px', marginTop: '15px', fontWeight: '500', color: '#333' }}>
          Account not activated? <Link href="/" style={{ color: 'blue' }}>Click here</Link>
        </p>
        <div className={styles.or}>
          <hr className={styles.bar} />
          <span className="mx-3">OR</span>
          <hr className={styles.bar} />
        </div>
        <button className={styles.googleButton}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo"></img> Continue with Google
        </button>
      </div>
    </main>
  );
};

export default SignIn;