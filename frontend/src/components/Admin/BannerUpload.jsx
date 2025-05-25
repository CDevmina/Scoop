import React from "react";

function BannerUpload({ label, bannerPreview, onUpload }) {
  return (
    <div className="pb-4">
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="relative border border-gray-300 rounded-md mt-1 shadow-sm p-2 flex items-center bg-white">
        {bannerPreview ? (
          <img
            src={bannerPreview}
            alt={`${label} Preview`}
            className="max-h-40 object-contain rounded-md mr-4"
          />
        ) : (
          <p className="text-gray-600 mr-4">No image selected</p>
        )}
        <button
          type="button"
          onClick={() => document.getElementById(label.replace(/\s/g, "")).click()}
          className="bg-red-600 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-md hover:scale-105 hover:bg-red-800"
        >
          Upload Image
        </button>
        <input
          type="file"
          id={label.replace(/\s/g, "")}
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default BannerUpload;
