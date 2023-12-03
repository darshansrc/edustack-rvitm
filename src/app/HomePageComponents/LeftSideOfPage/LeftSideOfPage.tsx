import SignInForHomePage from "../../auth/signin/SignInForHomePage";

const LeftSideOfPage = (props) => {
  const widthClass =
    props.showSide === "leftSide" ? "w-full" : "w-1/2 max-md:hidden";

  return (
    <div key={props.showSide} className={`relative h-screen ${widthClass}`}>
      {/* the key prop is set to props.showSide.
      This means that when showSide changes,
      a new instance of the div and SignInForHomePage component will be created,
       triggering a re-render and the animation. */}
      <SignInForHomePage
        loginType={props.loginType}
        showSide={props.showSide}
        setShowSide={props.setShowSide}
      />
    </div>
  );
};

export default LeftSideOfPage;
