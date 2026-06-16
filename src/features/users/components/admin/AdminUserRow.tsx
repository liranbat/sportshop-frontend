import { useNavigate } from "react-router";
import { RoleBadge } from "@/components/RoleBadge";
import { UserStatusBadge } from "@/components/UserStatusBadge";
import type { UserResponse } from "@/features/auth/schema";

type Props = {
  user: UserResponse;
};

export function AdminUserRow({ user }: Props) {
  const navigate = useNavigate();
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const role = user.isAdmin ? "Admin" : "User";

  const goToDetail = () => {
    void navigate(`/profile/${user.id}`);
  };

  return (
    <tr
      onClick={goToDetail}
      className="cursor-pointer border-t border-cart-line-divider hover:bg-primary-blue-light"
    >
      <td className="px-4 py-3 align-middle text-body-small-bold text-text-primary">{user.id}</td>
      <td className="px-4 py-3 align-middle">
        <div className="flex flex-col">
          <span className="text-body-small-bold text-text-primary">{fullName}</span>
          <span className="text-caption-regular text-text-secondary">{user.email}</span>
        </div>
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
