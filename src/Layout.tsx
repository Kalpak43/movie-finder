import { Outlet } from "react-router";
import Header from "./components/Header";

function Layout() {
  return (
    <>
      <Header />
      <main className="px-8 md:px-20 py-10">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
