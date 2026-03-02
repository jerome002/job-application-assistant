import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function ProfileViewPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        setProfile(res.data.profile);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!profile) return <p className="text-center mt-20 text-gray-500 font-medium">Profile not found. Please create one.</p>;

  const initials = `${profile.personal?.first_name?.[0] || ""}${profile.personal?.last_name?.[0] || ""}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate("/dashboard")} className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2">
            ← Back to Dashboard
          </button>
          <button onClick={() => navigate("/profile/edit")} className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-gray-200">
            Edit Profile
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          {/* Top Banner Accent */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          
          <div className="px-8 pb-10">
            {/* Avatar & Name Section */}
            <div className="relative -mt-12 mb-6 flex items-end gap-6">
              <div className="w-28 h-28 rounded-3xl bg-white p-1.5 shadow-xl">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black tracking-tighter">
                  {initials}
                </div>
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-black text-gray-900">
                  {profile.personal?.first_name} {profile.personal?.last_name}
                </h1>
                <p className="text-blue-600 font-bold">{profile.experience?.[0]?.title || "Professional"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
              {/* Left Column: Skills & Settings */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Core Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded-xl border border-blue-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Platform Settings</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${profile.settings?.autoApply ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <p className="text-sm font-bold text-gray-700">
                      AI Auto-Apply: {profile.settings?.autoApply ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </section>
              </div>

              {/* Right Column: Experience */}
              <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Experience History</h3>
                <div className="space-y-6">
                  {profile.experience?.map((exp, i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-gray-100">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-blue-500"></div>
                      <h4 className="font-bold text-gray-900 leading-none">{exp.title}</h4>
                      <p className="text-sm text-gray-500 font-medium mt-1">{exp.company} • {exp.years} Years</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}