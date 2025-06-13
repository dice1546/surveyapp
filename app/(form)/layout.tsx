import Header from "@/components/header";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export const FormLayout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};
