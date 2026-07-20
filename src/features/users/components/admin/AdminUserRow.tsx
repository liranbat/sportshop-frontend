import { useNavigate } from "react-router";
import { Badge } from "@/components/Badge";
import type { UserResponse } from "@/features/auth/schema";
import { paths } from "@/lib/paths";

type Props = {
  user: UserResponse;
};

export function AdminUserRow({ user }: Props) {
  const navigate = useNavigate();
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const goToDetail = () => {
    void navigate(paths.profile.adminDetail(user.id));
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
        <Badge
          kind={user.isDeleted ? "DELETED" : "ACTIVE"}
          label={user.isDeleted ? "Deleted" : "Active"}
        />
      </td>
      <td className="px-4 py-3 align-middle">
        <Badge
          kind={user.isAdmin ? "ROLE_ADMIN" : "ROLE_USER"}
          label={user.isAdmin ? "Admin" : "User"}
        />
      </td>
    </tr>
  );
}
