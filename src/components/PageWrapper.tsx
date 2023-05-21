import React from "react";

interface Props {
  children: React.ReactNode;
}

const PageWrapper: React.FC<Props> = ({ children }) => {
  return <div className="max-w-lg mx-auto">{children}</div>;
};

export default PageWrapper;
