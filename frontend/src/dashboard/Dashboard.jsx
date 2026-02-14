import React from "react";
import { useProfile } from "../context/AppContext";
import { jsPDF } from "jspdf";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { state, dispatch } = useProfile();
  const { personal, skills, experience } = state.profile;

  // Logic for the professional status badge
  const isProfileComplete = skills.length > 0 && experience.length > 0;

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleEdit = () => {
    dispatch({ type: "GO_TO_STEP", step: 1 });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch({
        type: "UPDATE_PERSONAL",
        payload: { ...personal, profile_picture: reader.result }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let cursorY = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(`${personal.first_name} ${personal.last_name}`, 20, cursorY);
    
    cursorY += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${experience[0]?.role || "Professional"} | ${personal.age} Years Old`, 20, cursorY);

    cursorY += 5;
    doc.line(20, cursorY, 190, cursorY);

    cursorY += 15;
    doc.setFont("helvetica", "bold");
    doc.text("SKILLS", 20, cursorY);
    cursorY += 7;
    doc.setFont("helvetica", "normal");
    doc.text(skills.join(", ") || "None listed", 20, cursorY, { maxWidth: 170 });

    cursorY += 15;
    doc.setFont("helvetica", "bold");
    doc.text("EXPERIENCE", 20, cursorY);
    experience.forEach((exp) => {
      cursorY += 10;
      doc.text(`${exp.company} - ${exp.role} (${exp.years} yrs)`, 25, cursorY);
    });

    doc.save("Resume.pdf");
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.profileHeader}>
        <label className={styles.avatarLabel}>
          <div className={styles.avatar}>
            {personal.profile_picture ? (
              <img src={personal.profile_picture} alt="Profile" />
            ) : (
              <span>{personal.first_name?.charAt(0)}{personal.last_name?.charAt(0)}</span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
        </label>

        <div className={styles.mainInfo}>
          <div className={styles.nameRow}>
            <h1>{personal.first_name} {personal.last_name}</h1>
            <span className={isProfileComplete ? styles.badgeActive : styles.badgeDraft}>
              <span className={styles.dot}></span>
              {isProfileComplete ? "Open to Work" : "Draft Profile"}
            </span>
          </div>
          <p className={styles.subtitle}>
            {experience[0]?.role || "Candidate"} • {personal.age} Years Old
          </p>
        </div>

        <div className={styles.headerActions}>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      {/* Grid Content */}
      <div className={styles.contentGrid}>
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>Skills</h3>
          <div className={styles.skillCloud}>
            {skills.map((s, i) => <span key={i} className={styles.skillBadge}>{s}</span>)}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>Experience</h3>
          <div className={styles.timeline}>
            {experience.map((exp, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.expContent}>
                  <h4>{exp.role}</h4>
                  <p className={styles.company}>{exp.company}</p>
                  <span className={styles.years}>{exp.years} Years</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <footer className={styles.footer}>
        <button onClick={handleEdit} className={styles.secondaryBtn}>Edit Profile</button>
        <button onClick={handleExportPDF} className={styles.primaryBtn}>Download PDF Resume</button>
      </footer>
    </div>
  );
}