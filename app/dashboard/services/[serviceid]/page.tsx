/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Img from "@/app/_componants/Image";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";

export default function EditService({ params }) {
  const { language } = Usevariables();
  const id = params.serviceid;
  // const openinput = useRef<HTMLInputElement>(null);
  const openinput_2 = useRef<HTMLInputElement>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [feature, setFeature] = useState<string>("");

  const [Errors, setErrors] = useState<Record<string, string>>({});
  const [done, setdone] = useState<string>("");
  const [icon, seticon] = useState<File | null>(null);
  const [loading, setloading] = useState<boolean>(true);
  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
  });
  // const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    // جلب بيانات الخدمة الحالية لعرضها في الحقول
    const fetchServiceData = async () => {
      try {
        const response = await instance.get(`/services/${id}`);
        const service = response.data.data;

        setForm({
          title_en: service.title_en,
          title_ar: service.title_ar,
          description_en: service.description_en,
          description_ar: service.description_ar,
        });

        setFeatures(service.features || []);
        // setImages(service.images || []);
        seticon(service.icon || null);
        setloading(false);
      } catch (error) {
        setloading(false);
        console.error("Error fetching service data", error);
      }
    };

    fetchServiceData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];

      if (selectedFile && selectedFile.type.startsWith("image/")) {
        seticon(selectedFile);
      } else {
        alert("Please select a valid image file.");
      }
    }
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (files) {
  //     setImages((prevImages) => [...prevImages, ...Array.from(files)]);
  //   }
  // };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && feature.trim()) {
      e.preventDefault();
      setFeatures((prevFeatures) => [...prevFeatures, feature]);
      setFeature("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title_en", form.title_en);
    formData.append("title_ar", form.title_ar);
    formData.append("description_en", form.description_en);
    formData.append("description_ar", form.description_ar);
    formData.append("features", JSON.stringify(features));

    // images.forEach((image, index) => {
    //   formData.append(`images[${index}]`, image);
    // });

    if (typeof icon != "string") {
      if (icon) {
        formData.append("icon", icon);
      }
    }

    try {
      const response = await instance.post(`/services/${id}`, formData);
      console.log(response.data);
      setdone(
        language === "en"
          ? "Service updated successfully!"
          : "تم تعديل الخدمة بنجاح!"
      );
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
      }
    }
  };

  const deleteFeature = (title: string) => {
    setFeatures((prevFeatures) =>
      prevFeatures.filter((feature) => feature !== title)
    );
  };

  return (
    <>
      {!loading ? (
        <div className="w-full mt-16 mx-auto p-6 bg-white shadow-lg rounded-lg relative">
          <div className="flex  gap-4  items-center justify-between w-full">
            <Link
              className="px-4 py-2 rounded-md shadow-md bg-main_blue text-white  hover:bg-transparent border border-transparent hover:border-main_blue duration-300 hover:text-black"
              href={`/dashboard/services/${id}/${id}`}
            >
              {language == "en" ? "Sub Services" : "الخدمات الفرعية"}
            </Link>
            <div className="flex items-center gap-1 text-white px-2 bg-green-300 w-fit shadow-md   hover:bg-transparent border border-transparent hover:border-green-400 duration-300 hover:text-black">
              <Link
                className="px-4 py-2 rounded-md    "
                href={`/dashboard/services/addsubservice/${id}`}
              >
                {language == "en"
                  ? "Add new Sub Services"
                  : "أضف خدمة فرعية جديدة"}
              </Link>
              <FaPlusCircle />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {language === "en" ? "Edit Service" : "تعديل الخدمة"}
          </h1>
          {done && (
            <p className="text-green-400 text-center text-[18px]">{done}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* حقل العنوان */}
            <div>
              <label
                htmlFor="title_en"
                className="block text-sm font-medium text-gray-700"
              >
                {language === "en" ? "Title" : "العنوان"}
              </label>
              <input
                type="text"
                name="title_en"
                id="title"
                value={form.title_en}
                onChange={handleChange}
                className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={
                  language === "en"
                    ? "Enter service title"
                    : "أدخل عنوان الخدمة"
                }
              />
              {Errors.title && (
                <p className="text-red-600 text-sm">{Errors.title}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="title_ar"
                className="block text-sm font-medium text-gray-700"
              >
                {language === "en" ? "Title" : "العنوان"}(عربى)
              </label>
              <input
                type="text"
                name="title_ar"
                id="title_ar"
                value={form.title_ar}
                onChange={handleChange}
                className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={
                  language === "en"
                    ? "Enter service title"
                    : "أدخل عنوان الخدمة"
                }
              />
              {Errors.title && (
                <p className="text-red-600 text-sm">{Errors.title}</p>
              )}
            </div>

            {/* حقل الوصف */}
            <div>
              <label
                htmlFor="description_en"
                className="block text-sm font-medium text-gray-700"
              >
                {language === "en" ? "Description" : "الوصف"}
              </label>
              <textarea
                name="description_en"
                id="description_en"
                value={form.description_en}
                onChange={handleChange}
                className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={
                  language === "en"
                    ? "Enter service description"
                    : "أدخل وصف الخدمة"
                }
              />
              {Errors.description && (
                <p className="text-red-600 text-sm">{Errors.description}</p>
              )}
            </div>
            {/* حقل الوصف */}
            <div>
              <label
                htmlFor="description_ar"
                className="block text-sm font-medium text-gray-700"
              >
                {language === "en" ? "Description" : "الوصف"}(عربى)
              </label>
              <textarea
                name="description_ar"
                id="description_ar"
                value={form.description_ar}
                onChange={handleChange}
                className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={
                  language === "en"
                    ? "Enter service description"
                    : "أدخل وصف الخدمة"
                }
              />
              {Errors.description && (
                <p className="text-red-600 text-sm">{Errors.description}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="features"
                className="block text-sm font-medium text-gray-700"
              >
                {language === "en" ? "Service Features" : "مميزات الخدمة"}
              </label>
              <input
                type="text"
                name="features"
                id="features"
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                onKeyPress={handleKeyPress}
                className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={
                  language === "en"
                    ? "Enter a feature and press Enter"
                    : "أدخل ميزة واضغط Enter"
                }
              />
              {Errors.features && (
                <p className="text-red-600 text-sm">{Errors.features}</p>
              )}
              <div className="mt-2">
                {features.map((sk, index) => (
                  <span
                    onClick={() => deleteFeature(sk)}
                    key={index}
                    className="inline-block cursor-pointer hover:bg-red-400 bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
            {/* رفع الايقونة */}
            <div>
              <label
                id="iconeimg"
                className="block text-sm font-medium text-gray-700"
              >
                {language === "en" ? "Service icon" : "أيقونة الخدمة"}
              </label>
              <div
                onClick={() => openinput_2.current?.click()}
                className={`mt-1 flex items-center overflow-hidden justify-center cursor-pointer border-2 border-dashed ${
                  Errors.images ? "border-red-400" : "border-sky-400"
                }   w-full h-[30vh]`}
              >
                {icon instanceof File ? (
                  <Img imgsrc={URL.createObjectURL(icon)} styles="w-[90px]" />
                ) : icon && typeof icon === "string" ? (
                  <Img imgsrc={icon} styles="w-[90px]" />
                ) : (
                  <FaPlusCircle
                    className={`size-12 ${
                      Errors.images ? "text-red-400" : "text-sky-500"
                    }`}
                  />
                )}
              </div>
              <input
                hidden
                ref={openinput_2}
                type="file"
                name="icon"
                id="iconeimg"
                onChange={handleImage}
              />
              {Errors.icon && (
                <p className="text-red-600 text-sm">{Errors.icon}</p>
              )}
            </div>

            {/* رفع الصورة */}
            {/* <div>
          <label className="block text-sm font-medium text-gray-700">
            {language === "en" ? "Service Images" : "صور الخدمة"}
          </label>
          <div
            onClick={() => openinput.current?.click()}
            className={`mt-1 flex items-center overflow-hidden justify-center cursor-pointer border-2 border-dashed ${
              Errors.images ? "border-red-400" : "border-sky-400"
            }   w-full h-[30vh]`}
          >
            {images.length > 0 ? (
              <div className="flex items-center gap-3">
                {images.map((img, index) => (
                  <Img
                    key={index}
                    imgsrc={URL.createObjectURL(img)}
                    styles="w-[150px]"
                  />
                ))}
              </div>
            ) : (
              <FaPlusCircle
                className={`size-12 ${
                  Errors.images ? "text-red-400" : "text-sky-500"
                } `}
              />
            )}
          </div>
          <input
            hidden
            multiple
            ref={openinput}
            type="file"
            name="images"
            id="serviceimg"
            accept="image/*"
            onChange={handleImageChange}
          />
          {Errors.images && (
            <p className="text-red-600 text-sm">{Errors.images}</p>
          )}
        </div> */}

            {/* زر الإرسال */}
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {language === "en" ? "Edit Service" : "تعديل الخدمة"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="h-screen relative">
          <LoadingSpiner />
        </div>
      )}
    </>
  );
}
