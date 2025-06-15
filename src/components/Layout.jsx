import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="relative min-h-screen space-y-4">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white">
        <Navbar />
      </div>
      <main className="mt-16">{children || <Outlet />}</main>
    </div>
  );
}

export default Layout;
