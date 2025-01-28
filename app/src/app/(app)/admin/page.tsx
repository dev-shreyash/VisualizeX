import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import UserLoad from "@/components/admin/userLoad";
import ServerStatus from "@/components/admin/serverStatus";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and has an admin role
  if (!session || session.user.role !== "ADMIN") {
    redirect("/403"); // Redirect unauthorized users to the 403 page
  }

  return (
    <div className="flex flex-col W-full mx-auto p-10 bg-slate-200  h-[100vh] ">
      <div className="flex-col w-full justify-between mb-10">
        <div className="flex justify-between w-full">
          <div className="flex-col ">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p>Welcome to the Admin Panel, {session.user.username}!</p>
          </div>
          <div className="flex-col items-center text-right justify-end">
            <h1 className="text-3xl font-bold">VisualizeX</h1>
            <p> ROLE: {session.user.role}</p>
          </div>
        </div>

        <hr />
        <div className="flex-row">
          <h1><ServerStatus /></h1>
        </div>
      </div>

      <div className="flex-col">
        <h1 className="text-3xl font-bold mb-5">Manage Users</h1>
        <UserLoad />
      </div>
    </div>
  );
}
