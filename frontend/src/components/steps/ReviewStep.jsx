import { useProfile } from "../../context/AppContext";

export default function ReviewStep() {
  const { state, dispatch } = useProfile();

  const { personal, account, skills, experience } = state.profile;

  /* ---------------- VALIDATION ---------------- */

  const isPersonalValid =
    personal.first_name &&
    personal.last_name &&
    personal.age;

  const isAccountValid =
    account.email &&
    account.password;

  const isSkillsValid = skills.length > 0;
  const isExperienceValid = experience.length > 0;

  const isFormValid =
    isPersonalValid &&
    isAccountValid &&
    isSkillsValid &&
    isExperienceValid;

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = () => {
    if (!isFormValid) return;

    console.log("SUBMITTED PROFILE:", state.profile);

    alert("Profile submitted successfully!");
    dispatch({ type: "RESET" });
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <h2>Review Your Profile</h2>

      {/* PERSONAL */}
      <section
        style={{
          border: "1px solid",
          padding: 10,
          marginBottom: 10,
          borderColor: isPersonalValid ? "green" : "red"
        }}
      >
        <h3>Personal {!isPersonalValid && "(Incomplete)"}</h3>
        <p>{personal.first_name} {personal.last_name}</p>
        <p>Age: {personal.age || "—"}</p>

        <button onClick={() => dispatch({ type: "GO_TO_STEP", step: 1 })}>
          Edit Personal
        </button>
      </section>

      {/* ACCOUNT */}
      <section
        style={{
          border: "1px solid",
          padding: 10,
          marginBottom: 10,
          borderColor: isAccountValid ? "green" : "red"
        }}
      >
        <h3>Account {!isAccountValid && "(Incomplete)"}</h3>
        <p>Email: {account.email || "—"}</p>

        <button onClick={() => dispatch({ type: "GO_TO_STEP", step: 2 })}>
          Edit Account
        </button>
      </section>

      {/* SKILLS */}
      <section
        style={{
          border: "1px solid",
          padding: 10,
          marginBottom: 10,
          borderColor: isSkillsValid ? "green" : "red"
        }}
      >
        <h3>Skills {!isSkillsValid && "(Add at least one)"}</h3>

        <ul>
          {skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <button onClick={() => dispatch({ type: "GO_TO_STEP", step: 3 })}>
          Edit Skills
        </button>
      </section>

      {/* EXPERIENCE */}
      <section
        style={{
          border: "1px solid",
          padding: 10,
          marginBottom: 10,
          borderColor: isExperienceValid ? "green" : "red"
        }}
      >
        <h3>Experience {!isExperienceValid && "(Add at least one)"}</h3>

        <ul>
          {experience.map((exp, i) => (
            <li key={i}>
              {exp.company} – {exp.role} ({exp.years} yrs)
            </li>
          ))}
        </ul>

        <button onClick={() => dispatch({ type: "GO_TO_STEP", step: 4 })}>
          Edit Experience
        </button>
      </section>

      {/* ACTIONS */}
      <button onClick={() => dispatch({ type: "PREV_STEP" })}>
        Back
      </button>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
      >
        Submit Profile
      </button>
    </>
  );
}
