import { techSkills } from "./skillList.js";

export const extractSkills = (description) => {
  // GUARD CLAUSE: If description is null, undefined, or not a string, exit early
  if (!description || typeof description !== 'string') {
    return [];
  }
  
  return techSkills.filter(skill => {
    const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    return regex.test(description);
  });
};