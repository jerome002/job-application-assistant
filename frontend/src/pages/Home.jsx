import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
      
      <div className="max-w-3xl text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-600 uppercase bg-blue-50 rounded-full">
          Powered by AI Match Engine
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Land your dream job with <span className="text-blue-600">precision.</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          The all-in-one assistant to find tech roles, track your progress, 
          and get instant AI-powered compatibility scores for every application.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => navigate("/signup")}
            className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200"
          >
            Get Started for Free
          </button>
          <button 
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-blue-100 hover:bg-gray-50 transition-all"
          >
            Sign In
          </button>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {[
          { title: "Smart Matching", desc: "Real-time skill gap analysis." },
          { title: "Auto-Tracking", desc: "Never lose an application link again." },
          { title: "AI Insights", desc: "Get feedback on your profile strength." }
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}