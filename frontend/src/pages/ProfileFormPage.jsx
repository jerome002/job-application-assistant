import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { AppContext } from "../context/AppContext";

export default function ProfileFormPage() {
  const navigate = useNavigate();
  const [personal, setPersonal] = useState({ first_name: "", last_name: "" });
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [autoApply, setAutoApply] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        const profile = res.data.profile || {};
        if (profile.personal) setPersonal(profile.personal);
        if (profile.skills) setSkills(profile.skills);
        if (profile.experience) setExperience(profile.experience);
        if (profile.settings?.autoApply) setAutoApply(profile.settings.autoApply);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await API.put("/profile", { personal, skills, experience, settings: { autoApply } });
      navigate("/profile/view");
    } catch (err) {
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-pulse font-black text-gray-400">Loading Builder...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-gray-900">Build Your AI Profile</h1>
          <p className="text-gray-500 mt-2 font-medium">This information powers our AI matching engine.</p>
        </div>

        <div className="space-y-6">
          {/* Section: Personal */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="first_name"
                placeholder="First Name"
                value={personal.first_name}
                onChange={(e) => setPersonal({...personal, first_name: e.target.value})}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                name="last_name"
                placeholder="Last Name"
                value={personal.last_name}
                onChange={(e) => setPersonal({...personal, last_name: e.target.value})}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Section: Skills */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Skills & Tech Stack</h3>
              <button onClick={() => setSkills([...skills, ""])} className="text-blue-600 font-bold text-sm hover:underline">+ Add New</button>
            </div>
            <div className="space-y-3">
              {skills.map((skill, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="e.g. React.js"
                    value={skill}
                    onChange={(e) => {
                      const newSkills = [...skills];
                      newSkills[i] = e.target.value;
                      setSkills(newSkills);
                    }}
                    className="flex-1 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} className="p-3 text-gray-300 hover:text-red-500 transition-colors">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Settings */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Enable AI Auto-Apply</h3>
              <p className="text-sm text-gray-500">Automatically apply to jobs with a match score over 85%.</p>
            </div>
            <input
              type="checkbox"
              checked={autoApply}
              onChange={(e) => setAutoApply(e.target.checked)}
              className="w-6 h-6 rounded-lg text-blue-600 border-gray-200 focus:ring-blue-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
            >
              {isSaving ? "Saving..." : "Save & Complete"}
            </button>
            <button 
              onClick={() => navigate("/dashboard")} 
              className="px-8 bg-white text-gray-500 py-5 rounded-2xl font-bold border border-gray-100 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}