import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = ({ btn, btnRef }: { btn: string; btnRef: string }) => {
  return (
    <div className="bg-[#f2fafc] dark:bg-transparent w-full h-full flex flex-col justify-center sm:flex-row gap-4">
      <div className="w-full sm:w-1/2 flex flex-col gap-4 text-center sm:text-start sm:gap-8 justify-center px-8 lg:px-16 xl:px-32 py-4">
        <h3 className="text-3xl font-semibold">Simplify Staff Management</h3>
        <p className="text-sm">
          Meet the smartest staff management system to manage attendance,
          payroll, compliances, and much more.
        </p>
        <Link href={btnRef} className="w-full flex justify-center mt-8">
          <Button variant={"outline"} className="w-60">
            {btn}
          </Button>
        </Link>
      </div>
      <div className="w-full sm:w-1/2 flex items-center ">
        <div className="w-full relative h-96">
          <Image
            src={"/a2.png"}
            alt="attendance img"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
