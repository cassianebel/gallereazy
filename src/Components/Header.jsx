import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-zinc-300">
      <div className="max-w-[1700px] mx-auto flex justify-between items-center p-4">
        <h1>
          <NavLink to="/">Gallereazy</NavLink>
        </h1>
        <nav className="flex gap-4">
          <NavLink to="/discover">Discover</NavLink>
          <NavLink to="/create">Create</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
