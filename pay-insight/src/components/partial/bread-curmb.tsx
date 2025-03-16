import { ThemeToggle } from "@/components/partial/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";

const BreadCrumb = () => {
  return (
    <div>
      {/* <div>BreadCrumb</div> */}

      <header className="flex items-center h-16 px-4 border-b border-b-neutral-200 dark:border-b-neutral-800 shrink-0 md:px-6 justify-between">
        <div className="flex items-center justify-center gap-4">
          <div className="flex justify-center items-center">
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
        {/* <Link
          href="/"
          className="flex items-center justify-center gap-2 text-lg font-semibold md:text-base"
          prefetch={false}
        >
          <FaFireFlameCurved size={24} className="font-bold text-sky-300" />
          <span className="font-bold text-lg text-primary dark:text-white">
            InferNo
          </span>
        </Link> */}
        <div className="z-10 sm:hidden">{/* <MobileNav /> */}</div>
      </header>
    </div>
  );
};

export default BreadCrumb;
