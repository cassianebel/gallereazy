import { NavLink } from "react-router-dom";
import { IoInvertMode } from "react-icons/io5";

const Header = ({ toggleTheme }) => {
  return (
    <header className="bg-zinc-100 dark:bg-zinc-900 bg-opacity-20 dark:bg-opacity-20 backdrop-blur-2xl sticky top-0 z-50 text-black dark:text-white">
      <div className="max-w-[1700px] mx-auto flex justify-between items-center p-4">
        <h1>
          <NavLink to="/">Gallereazy</NavLink>
        </h1>
        <nav className="flex items-center gap-4">
          <NavLink to="/discover">Discover</NavLink>
          <NavLink to="/create">Create</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <button
            onClick={toggleTheme}
            className="text-xl px-4 py-2 rounded-full"
          >
            <IoInvertMode />
            <span className="sr-only">Toggle Theme</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
