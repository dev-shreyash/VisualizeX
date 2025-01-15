"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";

// Define the user interface
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserLoad() {
  const [users, setUsers] = useState<User[]>([]); // Use User[] as the type for users
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Use User[] as the type for filtered users
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null); // Track user being edited

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/users");
        const sortedUsers = response.data.users.sort((a: User, b: User) => a.id - b.id); // Sort users by id
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers); // Initialize filtered users and sort them
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter(
      (user: User) =>
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user); // Set the user to be edited
  };

  const handleSave = () => {
    if (editingUser) {
      if (window.confirm("Are you sure you want to save changes?")) {
        axios
          .patch(`/api/admin/users`, editingUser)
          .then((response) => {
            alert("Changes saved!");
            setEditingUser(null); // Exit editing mode
            // Optionally, you can update the user in the state here
            setUsers((prevUsers) => {
              const updatedUsers = prevUsers.map((user: User) =>
                user.id === editingUser.id ? editingUser : user
              );
              // Sort users by id after update
              return updatedUsers.sort((a: User, b: User) => a.id - b.id);
            });
            setFilteredUsers((prevFilteredUsers) => {
              const updatedFilteredUsers = prevFilteredUsers.map((user: User) =>
                user.id === editingUser.id ? editingUser : user
              );
              // Sort filtered users by id after update
              return updatedFilteredUsers.sort((a: User, b: User) => a.id - b.id);
            });
          })
          .catch((error) => {
            console.error("Error saving changes:", error);
            alert("Failed to save changes.");
          });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null); // Exit editing mode without saving
  };

  const handleDelete = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`/api/admin/users`, { data: { id: userId } })
        .then(() => {
          alert("User deleted!");
          // Remove the user from the state after deletion
          setUsers((prevUsers) =>
            prevUsers.filter((user: User) => user.id !== userId).sort((a: User, b: User) => a.id - b.id)
          );
          setFilteredUsers((prevFilteredUsers) =>
            prevFilteredUsers.filter((user: User) => user.id !== userId).sort((a: User, b: User) => a.id - b.id)
          );
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          alert("Failed to delete user.");
        });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        Loading users...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">User List</h2>

      {/* Search Bar */}
      <div className="mb-6 w-full">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={handleSearch}
          className="w-[40%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      {/* User Table */}
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
            <th className="border border-gray-300 px-4 py-2">Created At</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user: User) => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingUser?.id === user.id ? (
                    <input
                      type="text"
                      value={editingUser?.username}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          username: e.target.value,
                        })
                      }
                      className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    user.username || "N/A"
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingUser?.id === user.id ? (
                    <input
                      type="email"
                      value={editingUser?.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingUser?.id === user.id ? (
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value,
                        })
                      }
                      className="w-full p-1 border border-gray-300 rounded-md"
                    >
                      {editingUser.role === "ADMIN" ? (
                        <>
                          <option value="ADMIN">ADMIN</option>
                          <option value="USER">USER</option>
                        </>
                      ) : (
                        <>
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </>
                      )}
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingUser?.id === user.id
                    ? new Date().toLocaleDateString() // Set current date if editing
                    : new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingUser?.id === user.id ? (
                    <>
                      <Button
                        onClick={handleSave}
                        className="px-6 py-2 bg-emerald-800 text-white  rounded-md"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleEdit(user)}
                        className="px-4 py-2 bg-emerald-400 text-white rounded-md"
                        disabled={editingUser !== null} // Disable if editingUser is not null
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.id)}
                        className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
                        disabled={editingUser !== null} // Disable if editingUser is not null
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
