import { useEffect, useState } from "react";
import { getSkills } from "../services/supabaseApi";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { FaMessage } from "react-icons/fa6";
import { useLocation } from "react-router-dom";

function Userprofile({ userId }) {
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  //scrollbar to top as it is rpeserving prebbious location
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    if (!userId) return;
    setSkillsLoading(true);

    getSkills(userId)
      .then((data) => {
        setSkills(data);
        setSkillsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching skills:", error);
        toast.error("Failed to fetch skills");
        setSkillsLoading(false);
      });
  }, [userId]);

  if (!skills.length && !skillsLoading)
    return (
      <div className="text-center mt-12 text-gray-500">
        No skills shared yet.
      </div>
    );

  return (
    <div className="flex flex-col justify-start items-center p-8">
      {/* User profile Section */}
      {/* Currently using user details from skills as no users table is maintained */}

      <div className="py-2 flex gap-4 items-center mb-2">
        <div className="bg-gray-200 rounded-full w-12 h-12 flex justify-center items-center cursor-pointer">
          {/* <img src="" alt="" /> */}
          <div className="text-lg font-medium text-gray-600">
            {skills[0]?.user_email.charAt(0).toUpperCase() || "?"}
          </div>
        </div>
        <div>
          <h1 className="font-semibold  text-gray-800 cursor-pointer">
            {skills[0]?.user_email || "Anonymous"}
          </h1>
        </div>
      </div>
      {/*  Displaying skills */}
      <h1 className="text-2xl font-sembold my-4">
        {skills.length} {skills.length === 1 ? "Skill" : "Skills"} shared so far
      </h1>
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
              className="flex flex-col justify-center capitalize rounded border w-70 h-40 p-6 shadow-md hover:bg-gray-100 transition"
            >
              <div className=" flex items-start justify-between">
                <h3 className="font-bold text-lg">{skill.title}</h3>
                {/* <p className="text-xs text-gray-500">
                  {new Date(skill.created_at).toLocaleDateString()}
                </p> */}
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {skill.category}
                </span>
              </div>

              <p className="text-sm text-gray-600 flex justify-between items-center">
                {skill.description.slice(0, 10)}...{" "}
              </p>

              {skill.can_help ? (
                <div className="flex justify-between gap-2 mt-4">
                  <a
                    className=" flex items-center gap-2 text-sm bg-blue-100 rounded-full px-2 py-1 text-blue-600 hover:bg-blue-200"
                    href={`mailto:${skill.user_email}`}
                  >
                    <FaMessage /> Reach out
                  </a>
                  <p className="text-green-800 bg-green-100 text-sm rounded-full px-2 py-1 hover:bg-green-200">
                    Open to help{" "}
                  </p>
                </div>
              ) : (
                ""
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Userprofile;
