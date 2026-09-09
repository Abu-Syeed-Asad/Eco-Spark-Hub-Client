"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const AboutContent = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);

    router.push(`${pathName}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    router.push(`${pathName}?${params.toString()}`);
  };

  const clearExtraUrl = () => {
    router.push(pathName);
  };

  const handleSearch = (search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", search);

    router.push(`${pathName}?${params.toString()}`);
  };

  const getInfoFromUrl = () => {
    const urlData: string[] = [];
    const searchInfo = searchParams.toString();
    const data = searchInfo.split("&");

    data.forEach((item) => {
      if (item) {
        const [key] = item.split("=");
        urlData.push(key);
      }
    });

    console.log(urlData, "actual");
  };

  return (
    <div className="space-y-4 p-5">
      <h1 className="text-2xl font-bold">URL Modification Demo</h1>

      <div className="space-x-2">
        <button onClick={() => handleStatusChange("active")} className="border px-3 py-1">
          Active
        </button>

        <button onClick={() => handleStatusChange("inactive")} className="border px-3 py-1">
          Inactive
        </button>
      </div>

      <div className="space-x-2">
        <button onClick={() => handlePageChange(1)} className="border px-3 py-1">
          Page 1
        </button>

        <button onClick={() => handlePageChange(2)} className="border px-3 py-1">
          Page 2
        </button>

        <button onClick={() => handlePageChange(3)} className="border px-3 py-1">
          Page 3
        </button>

        <button onClick={clearExtraUrl} className="border px-3 py-1">
          clearExtraUrl
        </button>
      </div>

      <div className="space-x-2">
        <button onClick={() => handleSearch("react")} className="border px-3 py-1">
          Search React
        </button>

        <button onClick={getInfoFromUrl} className="border px-3 py-1">
          get url info
        </button>
      </div>

      <div className="mt-6">
        <h2 className="font-bold">Current URL Params</h2>

        <p>Status: {searchParams.get("status") ?? "None"}</p>
        <p>Page: {searchParams.get("page") ?? "1"}</p>
        <p>Search: {searchParams.get("search") ?? "None"}</p>
      </div>
    </div>
  );
};

const About = () => {
  return (
    <Suspense fallback={<div className="p-5">Loading URL demo...</div>}>
      <AboutContent />
    </Suspense>
  );
};

export default About;