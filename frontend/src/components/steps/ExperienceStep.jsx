import { useState } from "react";
import { useProfile } from "../../context/AppContext";

export default function ExperienceStep() {
const {state,dispatch}=useProfile();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");

  const addExperience = () => {
    if (!company || !role || !years) return;

    dispatch({
      type: "ADD_EXPERIENCE",
      value: { company, role, years }
    });

    setCompany("");
    setRole("");
    setYears("");
  };

  return (
    <>
      <h2>Experience</h2>

      <input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <input
        placeholder="Years"
        value={years}
        onChange={(e) => setYears(e.target.value)}
      />

      <button onClick={addExperience}>Add Experience</button>

      <ul>
        {state.profile.experience.map((exp, index) => (
          <li key={index}>
            {exp.company} - {exp.role} ({exp.years} yrs)
            <button
              onClick={() =>
                dispatch({ type: "REMOVE_EXPERIENCE", index })
              }
            >
              Remove Experience
            </button>
          </li>
        ))}
      </ul>

      <button onClick={() => dispatch({ type: "PREV_STEP" })}>
        Back
      </button>

      <button onClick={() => dispatch({ type: "NEXT_STEP" })}>
        Next
      </button>
    </>
  );
}
