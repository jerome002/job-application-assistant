import { useState } from "react";
import { useProfile } from "../../context/AppContext";
import styles from "./ExperienceStep.module.css";
import api from "../../utils/api";

export default function ExperienceStep() {
  const { state, dispatch } = useProfile();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const experiences = state?.profile?.experience ?? [];

  const handleAddOrUpdate = () => {
    if (!company.trim() || !role.trim() || !years.trim()) return setError("All fields required.");
    const newEntry = { company: company.trim(), role: role.trim(), years: years.trim() };

    if (editingIndex !== null) {
      dispatch({ type: "UPDATE_EXPERIENCE_FIELD", index: editingIndex, value: newEntry });
      setEditingIndex(null);
    } else {
      dispatch({ type: "ADD_EXPERIENCE", value: newEntry });
    }
    setCompany(""); setRole(""); setYears(""); setError("");
  };

  const handleNext = async () => {
    if (experiences.length === 0) return setError("Add at least one experience.");
    setLoading(true);
    try {
      const res = await api.put("/profile/experience", { experience: experiences });
      dispatch({ type: "LOAD_PROFILE", payload: res.data });
      dispatch({ type: "NEXT_STEP" });
    } catch (err) {
      setError("Failed to save experience");
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Experience</h2>
      <div className={styles.fieldGroup}>
        <input className={styles.input} placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
        <input className={styles.input} placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
        <input className={styles.input} type="number" value={years} onChange={(e) => setYears(e.target.value)} />
      </div>
      <button className={styles.addButton} onClick={handleAddOrUpdate}>
        {editingIndex !== null ? "Update" : "Add"}
      </button>
      <ul className={styles.list}>
        {experiences.map((exp, index) => (
          <li key={index} className={styles.listItem}>
            <span onClick={() => {setCompany(exp.company); setRole(exp.role); setYears(exp.years); setEditingIndex(index);}}>
              {exp.company} ({exp.years} yrs) 📝
            </span>
            <button onClick={() => dispatch({ type: "REMOVE_EXPERIENCE", index })}>Remove</button>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <button onClick={() => dispatch({ type: "PREV_STEP" })}>Back</button>
        <button onClick={handleNext} disabled={loading}>Next</button>
      </div>
    </div>
  );
}