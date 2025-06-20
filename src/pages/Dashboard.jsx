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
    canHelp: false,
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
      user_email: user.email,
      can_help: form.canHelp,
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
          canHelp: false,
        });
        return getSkills(user.id);
      })
      .then((data) => {
        setSkills(data);
      })
      .catch(() => {
        toast.error("Error adding skill!");
      })
      .finally(() => {
        setLoading(false);
      });

    // Reset form after submission
  }
  return (
    <div className="flex flex-col p-4 items-center justify-center min-h-screen">
      <p className="mb-2 text-lg letter-spacing-10">
        Hey, {user?.email} <br />
      </p>

      <h1 className="text-2xl text-center font-bold mb-4">Add Skill</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-80 border p-6 rounded-lg shadow-md"
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
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.canHelp}
            onChange={(e) => setForm({ ...form, canHelp: e.target.checked })}
          />
          <span>I'm open to helping others with this skill</span>
        </label>
        <button disabled={loading} className="btn" type="submit">
          {loading ? <ClipLoader color="white" /> : "Submit"}
        </button>
      </form>
      {/*  Displaying skills */}
      <h2 className="text-xl font-semibold mt-8">Your Skills</h2>
      <ul className="max-w-4xl flex flex-wrap items-center justify-center mt-4 gap-4">
        {skillsLoading && (
          <div className="flex justify-center items-center h-20">
            <ClipLoader color="#000" />
          </div>
        )}
        {!skillsLoading &&
          skills.map((skill) => (
            <li
              key={skill.id}
              className="capitalize rounded border w-60 h-30 p-6 shadow-md hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{skill.title}</h3>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full self-start">
                  {skill.category}
                </span>{" "}
              </div>
              <p className="text-sm text-gray-600">
                {skill.description.slice(0, 15)}...
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Dashboard;
