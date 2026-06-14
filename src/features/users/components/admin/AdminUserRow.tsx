import { RoleBadge } from "@/components/RoleBadge";
import { UserStatusBadge } from "@/components/UserStatusBadge";
import type { UserResponse } from "@/features/auth/schema";

type Props = {
  user: UserResponse;
};

export function AdminUserRow({ user }: Props) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const role = user.isAdmin ? "Admin" : "User";

  return (
    <tr className="border-t border-cart-line-divider">
      <td className="px-4 py-3 align-middle text-body-small-bold text-text-primary">{user.id}</td>
      <td className="px-4 py-3 align-middle text-body-small text-text-primary">{fullName}</td>
      <td className="px-4 py-3 align-middle text-body-small text-text-secondary wrap-break-word">
        {user.email}
      </td>
      <td className="px-4 py-3 align-middle text-body-small text-text-secondary">{user.phone}</td>
      <td className="px-4 py-3 align-middle">
        <UserStatusBadge status={user.isDeleted ? "DELETED" : "ACTIVE"} />
      </td>
      <td className="px-4 py-3 align-middle">
        <RoleBadge role={role} />
      </td>
    </tr>
  );
}
