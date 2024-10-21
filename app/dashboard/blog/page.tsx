/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Img from "../../_componants/Image";
import Link from "next/link";
import { Usevariables } from "@/app/context/VariablesProvider";
import { instance } from "@/app/Api/axios";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";

export default function Blog() {
  const { language } = Usevariables();
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setloading] = useState(true);

  // Fetch data with pagination
  useEffect(() => {
    const getData = async (page: number) => {
      setloading(true);
      try {
        const response = await instance.get(`/blog-posts?page=${page}`);
        setData(response.data.data); // بيانات الخدمات
        setCurrentPage(response.data.current_page); // الصفحة الحالية
        setTotalPages(response.data.last_page); // عدد الصفحات
        setloading(false);
      } catch (error) {
        setloading(false);
        console.log(error);
      }
    };
    getData(currentPage);
  }, [currentPage]);

  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {loading ? (
        <div className="h-screen relative">
          <LoadingSpiner />
        </div>
      ) : data && data.length > 0 ? (
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-manrope text-4xl font-bold text-gray-900 dark:text-secend_text text-center mb-16">
              {language == "en" ? "All Posts" : "المقالات"}
            </h2>
            <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-y-8 gap-x-4 lg:gap-y-4 md:flex-wrap lg:gap-x-8">
              {data.map((blog, index) => (
                <Link
                  href={`/dashboard/blog/${blog?.id ? blog?.id : 5}`}
                  key={index}
                  className="group w-full border border-gray-300 rounded-2xl"
                >
                  <div className="flex items-center">
                    <Img
                      imgsrc={
                        blog.image ? blog.image : "/portfoliosection/5.jpg"
                      }
                      styles="rounded-t-2xl w-full h-[230px] object-cover"
                    />
                  </div>
                  <div className="p-4 lg:p-6 transition-all duration-300 rounded-b-2xl group-hover:bg-gray-50">
                    <span className="text-indigo-600 font-medium mb-3 block">
                      {new Date(blog.published_date).toLocaleDateString(
                        "en-US"
                      )}
                    </span>

                    <h4 className="text-xl text-gray-900 dark:text-secend_text font-medium leading-8 mb-5">
                      {language == "en" ? blog.title_en : blog.title_ar}
                    </h4>
                    <p className="text-gray-500 leading-6 mb-10">
                      {language === "ar"
                        ? blog.content_ar.length > 150
                          ? blog.content_ar.slice(0, 150) + "..."
                          : blog.content_ar
                        : blog.content_en.length > 150
                        ? blog.content_en.slice(0, 150) + "..."
                        : blog.content_en}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="pagination flex justify-center mt-8">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 mx-1 ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="text-center h-screen relative text-gray-500">
          <div className=" flex flex-col gap-3 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <p>
              {" "}
              {language == "en"
                ? "No Posts Available Yet ."
                : ">لا توجد مقالات متاحة"}
            </p>
            <Link
              className=" px-4 py-2 bg-sky-400 text-white rounded-md shadow-md "
              href={"/dashboard/addblog"}
            >
              {language == "en" ? "Add new Post" : "أضف مقال جديد"}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
