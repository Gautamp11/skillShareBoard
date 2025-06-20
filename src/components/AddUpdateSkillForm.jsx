import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addSkill, getSkill, updateSkill } from "../services/supabaseApi";
import { ClipLoader } from "react-spinners";

function AddUpdateSkillForm({
  user,
  fetchSkills,
  isEditing = null,
  setIsEditing,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    canHelp: false,
  });

  useEffect(() => {
    async function fetchSkill(isEditing) {
      isEditing !== null &&
        getSkill(isEditing)
          .then((data) =>
            setForm({
              title: data.title,
              category: data.category,
              description: data.description,
              canHelp: data.can_help,
            })
          )
          .catch(() => console.log("Error fetching skill"));
    }

    fetchSkill(isEditing);
  }, [isEditing]);

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

    if (isEditing) {
      updateSkill(isEditing, skill)
        .then(() => {
          toast.success("Skill updated successfully!");
          fetchSkills();
        })
        .catch(() => {
          toast.error("Error adding skill!");
        })
        .finally(() => {
          setLoading(false);
          setForm({
            title: "",
            category: "",
            description: "",
            canHelp: false,
          });
          setIsEditing(null);
        });
    } else {
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
          fetchSkills();
        })

        .catch(() => {
          toast.error("Error adding skill!");
        })
        .finally(() => {
          setLoading(false);
        });
    }

    // Reset form after submission
  }
  return (
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
        {loading ? (
          <ClipLoader color="white" />
        ) : isEditing ? (
          "Update"
        ) : (
          "Submit"
        )}
      </button>
      {isEditing && (
        <button
          type="button"
          className="btn bg-red-500"
          onClick={() => {
            setForm({
              title: "",
              category: "",
              description: "",
              canHelp: false,
            });
            setIsEditing(null);
          }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default AddUpdateSkillForm;
