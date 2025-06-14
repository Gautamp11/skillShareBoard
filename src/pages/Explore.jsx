import { useEffect, useState } from "react";
import { getAllSkills } from "../services/supabaseApi";
import SkillCard from "../components/SkillCard";

function Explore() {
  const categories = {
    frontend: ["HTML", "CSS", "JavaScript", "React", "Vue", "Angular"],
    backend: ["Node.js", "Express", "Django", "Flask", "Ruby on Rails"],
    devops: ["Docker", "Kubernetes", "AWS", "Azure", "GCP"],
    mobile: ["React Native", "Flutter", "Swift", "Kotlin", "Ionic"],
    dataScience: ["Python", "R", "Pandas", "NumPy", "Machine Learning"],
    design: ["Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator"],
    marketing: ["SEO", "Content Marketing", "Social Media", "Email Marketing"],
    business: ["Project Management", "Agile", "Scrum", "Lean", "Six Sigma"],
  };

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSkills() {
      setLoading(true);
      try {
        const data = await getAllSkills();
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  return (
    <div className="flex min-h-screen ">
      {/* Left Sidebar - Fixed */}
      <aside className="w-64 bg-gray-100 shadow-sm fixed h-screen p-4 hidden md:block overflow-y-auto">
        {Object.keys(categories).map((category, index) => {
          return (
            <div key={index} className=" capitalize mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {category}
              </h3>
              <ul className="space-y-1">
                {categories[category].map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center px-3 py-2 rounded-md hover:bg-blue-50 group"
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
      </aside>
      <main className="flex-1 p-4 ">
        <SkillCard skills={skills} />
      </main>
      {/* Right Sidebar - Desktop Only */}
      <aside className="w-64 bg-gray-100 shadow-sm fixed right-0 h-screen p-4 hidden lg:block">
        Right Sidebar Content
      </aside>

      {/* Mobile Footer Menu (Optional) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2">
        <button>Menu</button>
        <button>Categories</button>
      </div>
    </div>
  );
}

export default Explore;
