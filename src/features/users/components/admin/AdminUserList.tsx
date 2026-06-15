import { Notice } from "@/components/Notice";
import { AdminUserRow } from "@/features/users/components/admin/AdminUserRow";
import type { UserResponse } from "@/features/auth/schema";

type Props = {
  users: readonly UserResponse[];
  isLoading: boolean;
};

export function AdminUserList({ users, isLoading }: Props) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border-default bg-background-card shadow-card">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full table-fixed border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-background-page">
            <tr>
              <th className="w-[8%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                ID
              </th>
              <th className="w-[22%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Name
              </th>
              <th className="w-[26%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Email
              </th>
              <th className="w-[16%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Phone
              </th>
              <th className="w-[14%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Status
              </th>
              <th className="w-[14%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <AdminUserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>

        {users.length === 0 && !isLoading && (
          <div className="flex items-center justify-center p-8">
            <Notice
              variant="info"
              message="No users match your filters. Try clearing them or adjusting the criteria."
            />
          </div>
        )}
      </div>
    </div>
  );
}
