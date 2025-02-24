import React, { useState } from "react";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
  value,
  handleChange,
  placeholder = "Enter your Password",
  name = "password",
}: {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          handleChange(e);
        }}
        autoComplete="off"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 h-[calc(100%-4px)] my-auto mr-2 aspect-square flex items-center justify-center cursor-pointer"
        onClick={() => setShow((x) => !x)}
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

export default PasswordInput;
