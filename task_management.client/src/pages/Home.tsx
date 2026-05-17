import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { isLoggedIn } = useAuth();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.User?.Role;

  return (
    <div className="mx-auto max-w-5xl py-6 md:py-10">
      <section className="rounded-2xl border bg-white/95 p-8 shadow-sm md:p-12">
        <h2 className="mb-3 text-3xl font-bold text-slate-800 md:text-4xl">
          Task Management App
        </h2>
        <p className="mb-8 max-w-2xl text-base text-slate-600 md:text-lg">
          Create, update, and track your tasks.
        </p>
        <div className="flex flex-wrap gap-3">
          {!isLoggedIn && (
            <Link to="/auth">
              <Button size="lg" className="min-w-36">Sign In</Button>
            </Link>
          )}

          {isLoggedIn && role === "USER" && (
            <Link to="/userHome">
              <Button size="lg" className="min-w-36">My Tasks</Button>
            </Link>
          )}

          {isLoggedIn && role === "ADMIN" && (
            <Link to="/dashboard">
              <Button size="lg" className="min-w-36">Dashboard</Button>
            </Link>
          )}

          <Link to="/createTask">
            <Button variant="outline" size="lg" className="min-w-36">Create Task</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
