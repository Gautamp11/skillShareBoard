import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useAuth } from "../hooks/useAuth";

function Home() {
  const {
    authState: { status },
  } = useAuth();

  console.log(status);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-8 bg-white">
      {/* Header */}
      <div className="text-center max-w-3xl space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          <TypeAnimation
            sequence={[
              "Skill Share Board",
              2000,
              "Teach what you know",
              2000,
              "Learn what you need",
              2000,
            ]}
            speed={40}
            repeat={Infinity}
            className="text-blue-600"
          />
        </h1>
        <p className="text-lg text-gray-600">
          A place to share practical skills with your community
        </p>
      </div>

      {/* Core Features */}
      <div className="grid grid-cols-3 gap-6 max-w-4xl">
        {[
          {
            icon: "💡",
            title: "Share Skills",
            desc: "Post tutorials for things you're good at",
          },
          {
            icon: "🔍",
            title: "Find Help",
            desc: "Discover local experts",
          },
          {
            icon: "🤝",
            title: "Connect",
            desc: "Message other members",
          },
        ].map((feature, i) => (
          <div key={i} className="p-6 border rounded-lg text-center">
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8">
        {status === "unauthenticated" ? (
          <div className="flex gap-4">
            <Link
              to="/signup"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Join Now
            </Link>
          </div>
        ) : (
          <Link
            to="/dashboard"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;
