import { supabase } from "./supabaseClient";

export async function signUp({ email, password }) {
  let { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }
  return data;
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }
  return data;
}

export async function addSkill(skill) {
  const { data, error } = await supabase.from("skills").insert(skill);
  if (error) {
    throw error;
  }
  return data;
}

export async function getSkills(userId) {
  let { data: skills, error } = await supabase
    .from("skills")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return skills;
}

export async function getAllSkills() {
  let { data: skills, error } = await supabase
    .from("skills")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return skills;
}
// MAJOR CHANGE: Optimized filtered skills query
export async function getFilteredSkills(category, skill) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!category) {
    throw new Error("Category is required");
  }

  // I am blown with this nested query crazyyyyyy it autmioaticaly checks skills.id=== ski.._id in edoresemtn and give count
  let query = supabase
    .from("skills")
    .select(
      `
      *,
      endorsements:endorsements(count)
    `
    ) // Removed user relation but kept endorsements count
    .neq("user_id", user?.id) // Keeping the user filter
    .order("created_at", { ascending: false });

  if (category !== "all") {
    query = query.eq("category", category);
  }

  if (skill && skill !== "all") {
    query = query.ilike("title", `%${skill}%`);
  }

  const { data: skills, error } = await query;
  if (error) {
    throw error;
  }

  console.log(skills);

  return skills.map((skill) => ({
    ...skill,
    endorsement_count: skill.endorsements[0]?.count || 0,
  }));
}

// Endorsements section
export async function addEndorsement(skillId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) throw new Error("User not authenticated");

  // Check for existing endorsement
  const { data: existing, error: checkError } = await supabase
    .from("endorsements")
    .select("id")
    .eq("skill_id", skillId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existing) {
    // Remove if exists
    const { error: deleteError } = await supabase
      .from("endorsements")
      .delete()
      .eq("id", existing.id);
    if (deleteError) throw deleteError;
    return { action: "removed" };
  } else {
    // Add if doesn't exist
    const { data, error } = await supabase
      .from("endorsements")
      .insert({ skill_id: skillId, user_id: user.id })
      .select();
    if (error) throw error;
    return { action: "added", data };
  }
}

// export async function getFilteredSkills(category, skill) {
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!category) {
//     throw new Error("Category is required");
//   }
//   let query = supabase
//     .from("skills")
//     .select("*")
//     .neq("user_id", user?.id)
//     .order("created_at", { ascending: false });

//   if (category !== "all") {
//     query = query.eq("category", category);
//   }

//   if (skill && skill !== "all") {
//     query = query.ilike("title", `%${skill}%`);
//   }

//   const { data: skills, error } = await query;
//   if (error) {
//     throw error;
//   }
//   return skills;
// }

export async function deleteSkill(id) {
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function getSkill(isEditing) {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", isEditing)
    .single(); // 👈 to get a single row

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

export async function updateSkill(isEditing, skill) {
  const { data, error } = await supabase
    .from("skills")
    .update(skill)
    .eq("id", isEditing);

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

export async function getUser(userId) {
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error) {
    throw error;
  }
  return data.user;
}

// // Endorsements section
// export async function addEndorsement(skillId) {
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user?.id) throw new Error("User not authenticated");

//   // Check if endorsement already exists
//   const { data: existing, error: checkError } = await supabase
//     .from("endorsements")
//     .select("id")
//     .eq("skill_id", skillId)
//     .eq("user_id", user.id)
//     .maybeSingle();

//   if (checkError) throw checkError;

//   if (existing) {
//     // Remove endorsement
//     const { error: deleteError } = await supabase
//       .from("endorsements")
//       .delete()
//       .eq("id", existing.id);
//     if (deleteError) throw deleteError;
//     return { removed: true };
//   } else {
//     // Add new endorsement
//     const { data, error } = await supabase
//       .from("endorsements")
//       .insert({ skill_id: skillId, user_id: user.id })
//       .select();
//     if (error) throw error;
//     return { added: true, data };
//   }
// }

export async function getEndorsementCount(skillId) {
  const { count, error } = await supabase
    .from("endorsements")
    .select("*", { count: "exact", head: true }) // head: true => returns only count
    .eq("skill_id", skillId);

  if (error) throw error;

  return count ?? 0;
}

export async function getLikedSkills() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) throw new Error("User not authenticated");

  let { data, error } = await supabase
    .from("endorsements")
    .select("skill_id")
    .eq("user_id", user?.id);

  if (error) throw error;

  return data;
}

export async function getComments(skillId) {
  let { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("skill_id", skillId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return comments;
}

export async function addComment({ skill_id, content }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("comments")
    .insert({
      skill_id,
      user_id: user.id,
      user_email: user.email,
      content,
    })
    .select();

  if (error) throw error;
  return data;
}
