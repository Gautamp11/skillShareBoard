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

export async function getFilteredSkills(category, skill) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!category) {
    throw new Error("Category is required");
  }
  let query = supabase
    .from("skills")
    .select("*")
    .neq("user_id", user?.id)
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
  return skills;
}

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
