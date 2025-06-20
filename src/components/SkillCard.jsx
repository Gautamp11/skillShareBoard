import { FaMessage } from "react-icons/fa6";

function SkillCard({ skills }) {
  return (
    <div className="max-w-2xl mx-auto ">
      {skills.length > 0 ? (
        skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white h-60 p-6 rounded-lg shadow-sm mb-6 hover:shadow-md transition-shadow duration-200 border border-gray-100"
          >
            {/* User profile Section */}
            <div className="py-2 flex gap-4 items-center mb-2">
              <div className="bg-gray-200 rounded-full w-12 h-12 flex justify-center items-center">
                {/* <img src="" alt="" /> */}
                <span className="text-lg font-medium text-gray-600">
                  {skill?.user_email.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <h1 className="font-semibold  text-gray-800">
                  {skill?.user_email?.split("@")[0] || "Anonymous"}
                </h1>
                <p className="text-xs text-gray-500">
                  {new Date(skill.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            {/* Skill Section */}
            <div className=" flex flex-row justify-between items-start">
              <h2 className="text-lg font-semibold text-gray-800">
                {skill.title}
              </h2>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full self-start">
                {skill.category}
              </span>{" "}
            </div>
            <p className="text-gray-600 mt-4">{skill.description}</p>{" "}
            {skill.can_help ? (
              <div className="flex items-center gap-2 mt-4">
                <a
                  className=" flex items-center gap-2 text-sm bg-blue-100 rounded-full px-2 py-1 text-blue-600 hover:bg-blue-200"
                  href={`mailto:${skill.user_email}`}
                >
                  <FaMessage /> Reach out
                </a>
                <p className="text-green-800 w-fit bg-green-100 text-sm rounded-full px-2 py-1 hover:bg-green-200">
                  Open to help{" "}
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
        ))
      ) : (
        <h1 className="text-center font-semibold text-xl">
          No Skills found with current filter
        </h1>
      )}
    </div>
  );
}

export default SkillCard;
