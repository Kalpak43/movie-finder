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

  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRules([]);
    if (value.length >= 6) {
      setRules((prevRules) => {
        if (!prevRules.includes(1)) return [...prevRules, 1];
        return prevRules;
      });
    }

    if (/[A-Z]/.test(value)) {
      setRules((prevRules) => {
        if (!prevRules.includes(2)) return [...prevRules, 2];
        return prevRules;
      });
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      // newErrors.password =
      //   "Password must contain at least one special character";

      setRules((prevRules) => {
        if (!prevRules.includes(3)) return [...prevRules, 3];
        return prevRules;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      await dispatch(signUp(formData));
      toast({
        title: "Sign up successful",
        description:
          "A verification mail has been sent. Please verify before login.",
      });
      navigate("/login");
    }
  };

  return (
    <Card className="relative z-10 w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-blue-600">Sign up</CardTitle>
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
                validatePassword(e);
              }}
            />
            {formData.password.length > 0 && (
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
            className="w-full bg-[#f6c700]"
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
