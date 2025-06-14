import { useAuth } from "../hooks/useAuth";
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
