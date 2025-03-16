import Image from "next/image";
import React from "react";

const Tips = () => {
  return (
    <div className="py-16 flex flex-col gap-2 sm:flex-row">
      <div className="w-full sm:w-1/2 flex items-center">
        <div className="w-full relative h-96">
          <Image
            src={"/a-f.webp"}
            alt="feature pic"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="w-full sm:w-1/2 flex flex-col gap-4 px-4">
        <h2 className="text-3xl font-bold">
          Spend less time and manage your employees smartly
        </h2>
        <div>
          <h3 className="text-xl font-semibold">Easy to use</h3>
          <p>
            Pay Insight is easy to use, with a simple and intuitive interface
            that makes navigating and handling its features effortless.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Safe and secured</h3>
          <p>
            With top-notch security and advanced encryption, our app ensures
            your data is protected and your privacy is respected.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">100% data backup</h3>
          <p>
            Rest easy with 100% data backup, ensuring all your employee
            management information are automatically updated on cloud.
          </p>
        </div>
        <div className="text-xl font-semibold">create account!</div>
      </div>
    </div>
  );
};

export default Tips;
