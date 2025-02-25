import { useAppDispatch, useAppSelector } from "@/app/hook";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";
import { signUp } from "@/features/auth/authThunk";
import { useToast } from "@/hooks/use-toast";
import PasswordInput from "../PasswordInput";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function SignupCard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { toast } = useToast();
  const { error, loading } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [rules, setRules] = useState<number[]>([]);

  useEffect(() => {
    if (error)
      toast({
        title: error,
        variant: "destructive",
      });
  }, [error]);

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validatePassword = (value: string) => {
    const rulesSet = new Set<number>(); // Using Set to avoid duplicates

    if (value.length >= 6) rulesSet.add(1);
    if (/[A-Z]/.test(value)) rulesSet.add(2);
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) rulesSet.add(3);

    setRules(Array.from(rulesSet)); // Updating state

    return rulesSet.size === 3; // Return boolean for form validation
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm() && validatePassword(formData.password)) {
      const result = await dispatch(signUp(formData));

      if (signUp.fulfilled.match(result)) {
        toast({
          title: "Sign up successful",
          description:
            "A verification mail has been sent. Please verify before login.",
          variant: "success",
        });
        navigate("/login");
      } else {
        toast({
          title: "Sign up failed",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="relative z-10 w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-blue-600">
          Sign up
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <PasswordInput
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              handleChange={(e) => {
                handleChange(e);
                validatePassword(e.target.value);
              }}
            />
            {(errors.password || formData.password.length > 0) && (
              <div className="mt-2 text-xs">
                <p className="text-[var(--highlight)]">
                  Password must contain:{" "}
                </p>
                <p
                  className={` ${
                    rules.includes(1) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {rules.includes(1) ? (
                    <CircleCheck size={12} className="inline mr-2" />
                  ) : (
                    <CircleX size={12} className="inline mr-2" />
                  )}
                  At least 6 characters
                </p>
                <p
                  className={` ${
                    rules.includes(2) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {rules.includes(2) ? (
                    <CircleCheck size={12} className="inline mr-2" />
                  ) : (
                    <CircleX size={12} className="inline mr-2" />
                  )}
                  At least one capital letter
                </p>
                <p
                  className={` ${
                    rules.includes(3) ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {rules.includes(3) ? (
                    <CircleCheck size={12} className="inline mr-2" />
                  ) : (
                    <CircleX size={12} className="inline mr-2" />
                  )}
                  At least one special character
                </p>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm your Password"
              value={formData.confirmPassword}
              handleChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-400"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </Button>
        </form>
        <p className="text-xs text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default SignupCard;
