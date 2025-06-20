function LeftSideBar({
  categories,
  filteredCategory,
  handleFilterCategory,
  handleSkillFilter,
}) {
  return (
    <>
      {Object.keys(categories).map((category, index) => {
        return (
          <div key={index} className=" capitalize mb-6">
            <h1
              className={`text-lg font-semibold w-full p-2 rounded text-gray-800 mb-2 cursor-pointer hover:bg-gray-200 ${
                filteredCategory === category ? "bg-gray-200" : ""
              }`}
              onClick={() => handleFilterCategory(category)}
            >
              {category}
            </h1>
            <ul className="space-y-1">
              {categories[category].map((skill) => (
                <li
                  key={skill}
                  className="flex items-center px-3 py-2 rounded-md hover:bg-blue-50 group"
                  onClick={() => handleSkillFilter(skill, category)}
                >
                  <span className="text-gray-600 group-hover:text-blue-600">
                    {skill}
                  </span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100">
                    →
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}

export default LeftSideBar;
