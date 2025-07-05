import { FaComment, FaHeart, FaMessage } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {
  addComment,
  addEndorsement,
  getLikedSkills,
} from "../services/supabaseApi";
import { useEffect, useState } from "react";

function SkillCard({ skills, loading }) {
  const [likedSkills, setLikedSkills] = useState([]);
  const [isAnimating, setIsAnimating] = useState(null);

  const [comment, setComment] = useState("");

  const [comments, setComments] = useState([]);

  // Simplified like handler with optimistic updates
  const handleLike = async (skillId) => {
    const skill = skills.find((s) => s.id === skillId);
    const isLiked = likedSkills.some((like) => like.skill_id === skillId);

    // Optimistic UI update
    const updatedCount = isLiked
      ? skill.endorsement_count - 1
      : skill.endorsement_count + 1;
    skill.endorsement_count = Math.max(updatedCount, 0);

    setLikedSkills((prev) =>
      isLiked
        ? prev.filter((like) => like.skill_id !== skillId)
        : [...prev, { skill_id: skillId }]
    );
    setIsAnimating(skillId);

    try {
      await addEndorsement(skillId);
    } catch (error) {
      // Rollback on error
      skill.endorsement_count = isLiked
        ? skill.endorsement_count + 1
        : skill.endorsement_count - 1;
      console.error("Endorsement update failed:", error);
    } finally {
      setTimeout(() => setIsAnimating(null), 300);
    }
  };

  async function handleAddComment(skillId, e) {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      await addComment({ skill_id: skillId, content: comment });
      setComment("");
      // In next step, we’ll fetch the latest comments
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  }

  // Fetch liked skills on mount
  useEffect(() => {
    getLikedSkills().then(setLikedSkills).catch(console.error);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      {skills.length > 0 ? (
        skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white  p-6 rounded-lg shadow-sm mb-6 hover:shadow-md transition-shadow duration-200 border border-gray-100"
          >
            {/* User profile section */}
            <div className="py-2 flex gap-4 items-center mb-2">
              <div className="bg-gray-200 rounded-full w-12 h-12 flex justify-center items-center cursor-pointer">
                <Link
                  to={`/user/${skill.user_id}`}
                  className="text-lg font-medium text-gray-600"
                >
                  {skill?.user_email?.charAt(0).toUpperCase() || "?"}
                </Link>
              </div>
              <div>
                <Link
                  to={`/user/${skill.user_id}`}
                  className="font-semibold text-gray-800 cursor-pointer"
                >
                  {skill?.user_email?.split("@")[0] || "Anonymous"}
                </Link>
                <p className="text-xs text-gray-500">
                  {new Date(skill.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Skill content */}
            <div className="flex flex-row justify-between items-start">
              <h2 className="text-lg font-semibold text-gray-800">
                {skill.title}
              </h2>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full self-start">
                {skill.category}
              </span>
            </div>

            <p className="text-gray-600 mt-4">{skill.description}</p>

            {/* Help section */}
            {skill.can_help && (
              <div className="flex items-center gap-2 mt-4">
                <a
                  className="flex items-center gap-2 text-sm bg-blue-100 rounded-full px-2 py-1 text-blue-600 hover:bg-blue-200"
                  href={`mailto:${skill.user_email}`}
                >
                  <FaMessage /> Reach out
                </a>
                <p className="text-green-800 w-fit bg-green-100 text-sm rounded-full px-2 py-1 hover:bg-green-200">
                  Open to help
                </p>
              </div>
            )}

            {/* Endorsement section with animation */}
            <div className="flex items-center gap-6 mt-4 justify-end">
              <div className="flex items-center gap-1 transition-colors duration-300">
                <FaHeart
                  className={`${
                    likedSkills?.find((like) => like.skill_id === skill.id)
                      ? "text-red-500"
                      : "text-gray-300"
                  } text-lg ${isAnimating === skill.id ? "heart-animate" : ""}`}
                  onClick={() => handleLike(skill.id)}
                />
                <span className="text-sm">{skill.endorsement_count || 0}</span>
              </div>
            </div>

            <div className="flex bg-gray-100 p-4 rounded-md mt-4 flex-col text-gray-600">
              {}

              <form
                className="flex justify-between gap-4 p-2"
                onSubmit={(e) => handleAddComment(skill.id, e)}
              >
                <input
                  type="text"
                  name="comment"
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-white rounded-md p-2 w-full"
                  placeholder="Add comment"
                />
                <button className="btn" type="submit">
                  Post
                </button>
              </form>
            </div>
          </div>
        ))
      ) : (
        <h1 className="text-center font-semibold text-xl">
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <ClipLoader color="#000" />
            </div>
          ) : (
            "No Skills found with current filter"
          )}
        </h1>
      )}
    </div>
  );
}

export default SkillCard;
