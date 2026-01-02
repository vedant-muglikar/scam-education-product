import React from "react";
import { LoginForm } from "./components/LoginForm";

const loginPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:50px_50px] [mask-image:radial-gradient(white,transparent_85%)]" />
      <div className="w-full max-w-md mx-auto relative">
        <LoginForm />
      </div>
    </div>
  );
};

export default loginPage;
