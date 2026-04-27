import { useMemo } from "react";
import { Paperclip, Download, Plus } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { Th } from "../components/Th.jsx";
import { PAST_CHANGES } from "../data/mockChangeRequests.js";

const MOCK_FILES = [
  {
    name: "EV-Model-X_BOM_v1.2.xlsx",
    type: "spreadsheet",
    size: "2.4 MB",
    owner: "Doyoon Kim",
    visibility: "Internal",
    updated: "2026-04-22",
  },
  {
    name: "A-121_BMS_Spec_RevB.pdf",
    type: "document",
    size: "1.1 MB",
    owner: "Doyoon Kim",
    visibility: "Internal",
    updated: "2026-04-18",
  },
  {
    name: "ThermalSimulation_v3.zip",
    type: "archive",
    size: "18.6 MB",
    owner: "Doyoon Kim",
    visibility: "Internal",
    updated: "2026-04-23",
  },
  {
    name: "POSCO_Quote_RFX-2026-061.pdf",
    type: "document",
    size: "0.6 MB",
    owner: "POSCO Steel",
    visibility: "External",
    updated: "2026-04-22",
  },
  {
    name: "LG_Cell_DataSheet.pdf",
    type: "document",
    size: "3.2 MB",
    owner: "LG Energy Solution",
    visibility: "External",
    updated: "2026-03-14",
  },
];

export function ProjectFilesPage() {
  const internal = useMemo(
    () => MOCK_FILES.filter((f) => f.visibility === "Internal"),
    [],
  );
  const external = useMemo(
    () => MOCK_FILES.filter((f) => f.visibility === "External"),
    [],
  );

  return (
    <>
      <PageHeader
        title="Files"
        description="Drawings, specs, simulation outputs, and supplier-shared documents."
        actions={
          <>
            <button className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-primary bg-surface-paper border border-border hover:bg-surface-container-secondary transition-colors duration-fast">
              <Download size={14} /> Download all
            </button>
            <button
              className="inline-flex items-center gap-xs px-md py-sm rounded-md text-sm font-semibold text-text-inverse transition-colors duration-fast"
              style={{ backgroundColor: "var(--color-primary-main)" }}
            >
              <Plus size={14} /> Add file
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <FileTable title="Internal Only" files={internal} />
        <FileTable title="External Shared" files={external} />
      </div>
    </>
  );
}

function FileTable({ title, files }) {
  return (
    <section className="bg-surface-paper border border-border rounded-xl shadow-elevation-2 overflow-hidden">
      <div className="p-md border-b border-border flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
          {title} <span className="text-text-disabled">· {files.length}</span>
        </h3>
      </div>
      {files.length === 0 ? (
        <div className="text-center py-2xl text-sm text-text-secondary italic">
          No files yet.
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-xs text-text-secondary border-b border-border">
              <Th>File</Th>
              <Th>Owner</Th>
              <Th className="text-right">Updated</Th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr
                key={f.name}
                className="border-b border-border last:border-b-0 text-sm hover:bg-surface-container-secondary transition-colors duration-fast"
              >
                <td className="px-md py-sm">
                  <p className="text-sm font-semibold inline-flex items-center gap-xs">
                    <Paperclip
                      size={12}
                      className="text-text-secondary"
                    />
                    {f.name}
                  </p>
                  <p className="text-xs text-text-secondary mt-2xs">
                    {f.size}
                  </p>
                </td>
                <td className="px-md py-sm text-sm">{f.owner}</td>
                <td className="px-md py-sm text-right font-mono text-xs text-text-secondary">
                  {f.updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
