'use client';

import { useState, useEffect } from 'react';
import Upload from '../components/Upload';

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/products');
    if (response.ok) {
      const data = await response.json();
      setProducts(data);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProducts();
      }
    }
  };

  const handleUpdate = async (updatedProduct) => {
    const response = await fetch(`/api/products/${updatedProduct.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
      setEditingProduct(null);
      fetchProducts();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 text-sm">
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSave={handleUpdate}
        />
      )}

      <h1 className="text-2xl font-bold mb-4">Service List</h1>

      <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Images</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border p-2">{product.title}</td>
              <td className="border p-2">
                {product.img?.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="Product"
                    className="w-16 h-16 inline-block mr-2 object-cover"
                  />
                ))}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="bg-yellow-500 text-white px-2 py-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditProductForm({ product, onCancel, onSave }) {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [list, setList] = useState(product.list || []);
  const [img, setImg] = useState(product.img || []);

  const handleAddListItem = () => {
    setList([...list, '']);
  };

  const handleListChange = (index, value) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  const handleRemoveListItem = (index) => {
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...product,
      title,
      description,
      list,
      img,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-sm border p-4 bg-gray-100 rounded mb-6"
    >
      <h2 className="text-xl font-bold mb-4">Edit Service</h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 h-28 resize-y"
        />
      </div>

      {/* List */}
      <div className="mb-4">
        <label className="block font-medium">List Items</label>
        {list.map((item, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleListChange(idx, e.target.value)}
              className="flex-1 border p-2"
            />
            <button
              type="button"
              onClick={() => handleRemoveListItem(idx)}
              className="bg-red-500 text-white px-2 rounded"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddListItem}
          className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
        >
          + Add
        </button>
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <Upload onFilesUpload={(urls) => setImg(urls)} />
        <div className="flex gap-2 mt-2">
          {img.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="Uploaded"
              className="w-16 h-16 object-cover"
            />
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
