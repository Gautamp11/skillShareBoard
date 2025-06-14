import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { addSkill, getSkills } from "../services/supabaseApi";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
  });
  // I want to get user id
  const { user } = useAuth();

  useEffect(() => {
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
    fetchSkills();
  }, [user]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.category || !form.description) {
      toast.error("All fields are required");
      return;
    }
    const skill = {
      title: form.title,
      category: form.category,
      description: form.description,
      user_id: user.id,
    };
    setLoading(true);

    // Here you would typically send the skill to your backend or API
    addSkill(skill)
      .then(() => {
        toast.success("Skill added successfully!");
        setForm({
          title: "",
          category: "",
          description: "",
        });
        return getSkills(user.id);
      })
      .then((data) => {
        setSkills(data);
      })
      .catch((error) => {
        toast.error("Error adding skill!");
      })
      .finally(() => {
        setLoading(false);
      });

    // Reset form after submission
  }
  return (
    <div className="flex flex-col p-4 items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-80  p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <select
          className="border-none outline-none bg-gray-100 rounded p-2"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select a category</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="devops">DevOps</option>
          <option value="design">Design</option>
        </select>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button disabled={loading} className="btn" type="submit">
          {loading ? <ClipLoader color="white" /> : "Submit"}
        </button>
      </form>
      {/*  Displaying skills */}
      <h2 className="text-xl font-semibold mt-6">Your Skills</h2>
      <ul className="w-full flex flex-wrap items-center justify-center mt-4 gap-4">
        {skillsLoading && (
          <div className="flex justify-center items-center h-20">
            <ClipLoader color="#000" />
          </div>
        )}
        {!skillsLoading &&
          skills.map((skill) => (
            <li
              key={skill.id}
              className="bg-white w-60 p-2 rounded shadow-md hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{skill.title}</h3>
                <span className="text-sm font-medium bg-blue-500 rounded text-white w-16 text-center p-1">
                  {skill.category}
                </span>
              </div>
              <p className="text-sm">{skill.description}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Dashboard;
