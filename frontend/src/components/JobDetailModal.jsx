import React from "react";

export default function JobDetailModal({ job, onClose }) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{job.title}</h2>
            <p className="text-blue-600 font-bold">{job.company}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-3xl font-light">&times;</button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <div className="flex gap-4 mb-6">
            <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-semibold">📍 {job.location}</span>
            {job.salary && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">💰 {job.salary}</span>}
          </div>
          <h4 className="font-bold text-xs uppercase text-gray-400 mb-2">Job Description</h4>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>

        <div className="p-8 bg-gray-50">
          <button 
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}