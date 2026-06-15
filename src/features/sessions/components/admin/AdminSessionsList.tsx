import { Notice } from "@/components/Notice";
import { AdminSessionRow } from "@/features/sessions/components/admin/AdminSessionRow";
import type { Session } from "@/features/sessions/schema";

type Props = {
  sessions: readonly Session[];
  isLoading: boolean;
  actorUserId: number | null;
  onRevoke: (session: Session) => void;
};

export function AdminSessionsList({ sessions, isLoading, actorUserId, onRevoke }: Props) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border-default bg-background-card shadow-card">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <table className="w-full table-fixed border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-background-page">
            <tr>
              <th className="w-[9%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Token ID
              </th>
              <th className="w-[9%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                User ID
              </th>
              <th className="w-[18%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Name
              </th>
              <th className="w-[28%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Email
              </th>
              <th className="w-[22%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Expires at
              </th>
              <th className="w-[14%] px-4 py-3 text-left text-caption-regular font-semibold tracking-wider text-text-secondary uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <AdminSessionRow
                key={session.id}
                session={session}
                isOwnSession={actorUserId !== null && session.userId === actorUserId}
                onRevoke={onRevoke}
              />
            ))}
          </tbody>
        </table>

        {sessions.length === 0 && !isLoading && (
          <div className="flex items-center justify-center p-8">
            <Notice
              variant="info"
              message="No sessions match your filters. Try clearing them or adjusting the criteria."
            />
          </div>
        )}
      </div>
    </div>
  );
}
