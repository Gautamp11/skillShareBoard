import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { deleteSkill, getSkills } from "../services/supabaseApi";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaPen, FaTrash } from "react-icons/fa6";
import AddUpdateSkillForm from "../components/AddUpdateSkillForm";

function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(null);

  // I want to get user id
  const { user } = useAuth();

  async function fetchSkills() {
    if (!user?.id) return;
    setSkillsLoading(true);

    getSkills(user.id)
      .then((data) => {
        setSkills(data);
        setSkillsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching skills:", error);
        toast.error("Failed to fetch skills");
        setSkillsLoading(false);
      });
  }

  useEffect(() => {
    fetchSkills();
  }, [user]);

  function handleDelete(id) {
    deleteSkill(id)
      .then(() => {
        toast.success("Deleted successfully!");
        fetchSkills();
      })
      .catch(() => toast.error("Error deleting the skill"));
  }
  function handleEdit(id) {
    console.log(id);
    setIsEditing(id);
  }
  return (
    <div className="flex flex-col p-4 items-center justify-center min-h-screen">
      <p className="mb-2 text-lg letter-spacing-10">
        Hey, {user?.email} <br />
      </p>

      <h1 className="text-2xl text-center font-bold mb-4">
        {isEditing ? "Update Skill" : "Add Skill"}
      </h1>

      <AddUpdateSkillForm
        user={user}
        fetchSkills={fetchSkills}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      {/*  Displaying skills */}
      <h2 className="text-xl font-semibold mt-8">Your Skills</h2>
      <ul className="max-w-5xl flex flex-wrap items-center justify-center mt-4 gap-4">
        {skillsLoading && (
          <div className="flex justify-center items-center h-20">
            <ClipLoader color="#000" />
          </div>
        )}

        {!skillsLoading &&
          skills.map((skill) => (
            <li
              key={skill.id}
              className="capitalize rounded border w-70 h-40 p-6 shadow-md hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{skill.title}</h3>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full self-start">
                  {skill.category}
                </span>{" "}
              </div>

              <p className="text-sm text-gray-600 flex justify-between items-center">
                {skill.description.slice(0, 10)}...{" "}
                {skill.can_help ? (
                  <span className="bg-green-100 rounded-full px-2 py-1">
                    Open to help
                  </span>
                ) : (
                  ""
                )}
              </p>
              <div className="flex gap-4 mt-4 text-sm">
                <button onClick={() => handleDelete(skill.id)} className="btn">
                  <FaTrash />
                </button>{" "}
                <button className="btn" onClick={() => handleEdit(skill.id)}>
                  <FaPen />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Dashboard;
