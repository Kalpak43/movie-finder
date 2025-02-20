import SignupCard from "@/components/auth/SignupCard";

function SignupPage() {
  return (
    <div className="p-8 min-h-screen flex items-center justify-center bg-1 relative">
      <div className="overlay-1"></div>
      <SignupCard />
    </div>
  );
}

export default SignupPage;
