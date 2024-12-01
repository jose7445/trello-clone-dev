import SideBar from "../components/side-bar";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <SideBar></SideBar>

      <div className="p-4 sm:ml-64">
        <main>{children}</main>
      </div>
    </div>
  );
}
