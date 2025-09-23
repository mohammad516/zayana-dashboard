"use client";

import { useState } from "react";
import Upload from "../components/Upload";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [list, setList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [img, setImg] = useState([]);

  // Add new item to list
  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      setList((prev) => [...prev, newItem.trim()]);
      setNewItem("");
    }
  };

  // Remove item from list
  const handleRemoveItem = (index) => {
    setList((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle image upload
  const handleImgChange = (urls) => {
    if (Array.isArray(urls)) {
      setImg(urls);
    } else {
      setImg([urls]);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (img.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const payload = {
      title,
      description,
      list,
      img,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Service added successfully!");
        window.location.href = "/dashboard";
      } else {
        alert("Failed to add Service");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New Service</h1>

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      {/* Description (textarea instead of ReactQuill) */}
      <label className="block text-lg font-bold mb-2">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 mb-4"
        rows={6}
        placeholder="Write your Service description here..."
      />

      {/* List (JSON array of strings) */}
      <label className="block text-lg font-bold mb-2">List</label>
      <div className="flex mb-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="border p-2 flex-grow"
          placeholder="Enter item"
        />
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-3 ml-2 rounded"
        >
          +
        </button>
      </div>
      <ul className="mb-4">
        {list.map((item, i) => (
          <li
            key={i}
            className="flex justify-between items-center border p-2 mb-1 rounded"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => handleRemoveItem(i)}
              className="text-red-500 font-bold"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {/* Upload Images */}
      <Upload onFilesUpload={handleImgChange} />
      <p className="text-sm text-gray-500 mb-4">Max 12 images</p>

      {/* Submit */}
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Save Service
      </button>
    </form>
  );
}
