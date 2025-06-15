import { useAuth } from "../hooks/useAuth";

function SkillCard({ skills }) {
  const {
    authState: { session },
  } = useAuth();

  return (
    <div className="max-w-2xl mx-auto ">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="bg-white h-60 p-4 rounded-lg shadow-sm mb-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="py-2 flex gap-4 items-center mb-2 ">
            <div className="bg-gray-200 rounded-full w-12 h-12">
              <img src="" alt="" />
            </div>
            <h1>{session?.user?.email}</h1>
          </div>
          <div className="px-2 flex flex-row justify-between items-start">
            <h2 className="text-xl font-semibold text-gray-800">
              {skill.title}
            </h2>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full self-start">
              {skill.category}
            </span>{" "}
          </div>
          <p className="px-2 text-gray-600 mt-6">{skill.description}</p>
        </div>
      ))}
    </div>
  );
}

export default SkillCard;
