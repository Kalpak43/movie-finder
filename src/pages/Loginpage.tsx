import LoginCard from "@/components/auth/LoginCard";

function Loginpage() {
  return (
    <div className="p-8 min-h-screen flex items-center justify-center bg-1 relative">
      <div className="overlay-1"></div>
      <LoginCard />
    </div>
  );
}

export default Loginpage;
