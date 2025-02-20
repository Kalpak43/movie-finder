import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { signIn } from "@/features/auth/authThunk";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

function LoginCard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, error, loading } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  useEffect(() => {
    console.log(error);
  }, [error]);

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(signIn(formData));
    }
  };

  return (
    <Card className="relative z-10 w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-center">Log in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-[#f6c700]" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Log in"}
          </Button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <p className="text-xs text-center mt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default LoginCard;
