import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="flex items-start p-2">
      <div>
        <Image
          src="/waterlily.svg"
          width={130}
          height={200}
          alt="waterlily"
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default Header;
