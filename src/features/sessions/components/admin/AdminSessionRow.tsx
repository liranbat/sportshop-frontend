import { Button } from "@/components/Button";
import type { Session } from "@/features/sessions/schema";

type Props = {
  session: Session;
  isOwnSession: boolean;
  onRevoke: (session: Session) => void;
};

export function AdminSessionRow({ session, isOwnSession, onRevoke }: Props) {
  const fullName = `${session.firstName} ${session.lastName}`.trim();

  return (
    <tr className="border-t border-cart-line-divider hover:bg-primary-blue-light">
      <td className="px-4 py-3 align-middle text-body-small-bold text-text-primary">
        {session.id}
      </td>
      <td className="px-4 py-3 align-middle text-body-small-bold text-text-primary">
        {session.userId}
      </td>
      <td className="px-4 py-3 align-middle text-body-small text-text-primary wrap-break-word">
        {fullName}
      </td>
      <td className="px-4 py-3 align-middle text-body-small text-text-secondary wrap-break-word">
        {session.email}
      </td>
      <td className="px-4 py-3 align-middle text-body-small text-text-secondary">
        {formatExpiresAt(session.expiresAt)}
      </td>
      <td className="px-4 py-3 align-middle">
        <Button
          variant="danger"
          className="h-7 px-3 text-body-small"
          onClick={() => onRevoke(session)}
          disabled={isOwnSession}
          title={
            isOwnSession ? "You can't revoke your own session here. Sign out instead." : undefined
          }
        >
          Revoke
        </Button>
      </td>
    </tr>
  );
}

function formatExpiresAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}
