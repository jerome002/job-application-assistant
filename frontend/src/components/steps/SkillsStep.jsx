import { useState } from "react";
import { useProfile } from "../../context/AppContext";

export default function SkillsStep() {
  const {state,dispatch} = useProfile();
  const [skill, setSkill] = useState("");

  const isValid = state.profile.skills.length > 0;


  return (
    <>
      <h2>Skills</h2>

      <input
        placeholder="Add a skill"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
      />

      <button
        onClick={() => {
          if (skill.trim() === "") return;

          dispatch({
            type: "ADD_SKILL",
            value: skill
          });

          setSkill("");
        }}
      >
        Add Skill
      </button>

      <ul>
        {state.profile.skills.map((s, index) => (
          <li key={index}>
            {s}
            <button
              onClick={() =>
                dispatch({
                  type: "REMOVE_SKILL",
                  index
                })
              }
            >
              Remove Skill
            </button>
          </li>
        ))}
      </ul>

      <button onClick={() => dispatch({ type: "PREV_STEP" })}>
        Back
      </button>

      <button onClick={() => dispatch({ type: "NEXT_STEP" })} disabled={!isValid}>
        Next
      </button>
    </>
  );
}
