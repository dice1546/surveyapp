import Header from "@/components/header";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const FormLayout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen w-full">
      <Header />
      {children}
    </div>
  );
};

export default FormLayout