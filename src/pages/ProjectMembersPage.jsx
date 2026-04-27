import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Mail, UserPlus } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { Th } from "../components/Th.jsx";
import { PROJECTS } from "../data/mockProjects.js";

const ROLE_TONE = {
  PM: "var(--color-error-main)",
  "Design Engineer": "var(--color-info-main)",
  "Cost Manager": "var(--color-warning-main)",
  "Sourcing Manager": "var(--color-success-main)",
  "Quality Manager": "#7E22CE",
  Supplier: "var(--color-secondary-main)",
};

const ROLE_FOR_MEMBER = {
  "Doyoon Kim": "Design Engineer",
  "Jieun Park": "Cost Manager",
  "Hyunsu Lee": "Sourcing Manager",
  "Mikyung Choi": "Quality Manager",
};

export function ProjectMembersPage() {
  const { projectId } = useParams();
  const project = useMemo(
    () => PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0],
    [projectId],
  );

  const members = useMemo(() => {
    const list = [
      {
        ...project.owner,
        role: project.owner.role,
        primary: true,
      },
      ...project.members.map((m) => ({
        ...m,
        role: ROLE_FOR_MEMBER[m.name] ?? "Contributor",
      })),
    ];
    return list;
  }, [project]);

  return (
    <>
      <PageHeader
        title="Members"
        description="People with access to this project, by role."
        actions={
          <button
            className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
            style={{ backgroundColor: "var(--color-primary-main)" }}
          >
            <UserPlus size={14} /> Invite
          </button>
        }
      />

      <div className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-xs text-text-secondary border-b border-border">
              <Th>Member</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th className="text-right">Contact</Th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => {
              const roleColor =
                ROLE_TONE[m.role] ?? "var(--color-text-secondary)";
              return (
                <tr
                  key={i}
                  className="border-b border-border last:border-b-0 text-sm hover:bg-surface-container-secondary transition-colors duration-fast"
                >
                  <td className="px-md py-md">
                    <div className="flex items-center gap-sm">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-text-inverse"
                        style={{ backgroundColor: m.color }}
                      >
                        {m.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{m.name}</p>
                        {m.primary && (
                          <p className="text-[10px] uppercase tracking-wide font-bold text-text-secondary">
                            Project owner
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-md py-md">
                    <span
                      className="inline-flex items-center text-xs font-semibold px-sm py-2xs rounded-sm"
                      style={{
                        color: roleColor,
                        backgroundColor: `${roleColor}15`,
                      }}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="px-md py-md">
                    <span className="inline-flex items-center gap-xs text-xs">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{
                          backgroundColor: "var(--color-success-main)",
                        }}
                      />
                      Active
                    </span>
                  </td>
                  <td className="px-md py-md text-right">
                    <button className="inline-flex items-center gap-xs text-xs text-text-secondary hover:text-text-primary transition-colors duration-fast">
                      <Mail size={12} /> Message
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
