import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layouts/AppShell.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { BOMWorkspacePage } from "./pages/BOMWorkspacePage.jsx";
import { ProjectListPage } from "./pages/ProjectListPage.jsx";
import { CostWorkspacePage } from "./pages/CostWorkspacePage.jsx";
import { DesignChangeRequestPage } from "./pages/DesignChangeRequestPage.jsx";
import { SourcingWorkspacePage } from "./pages/SourcingWorkspacePage.jsx";
import { RfxDetailPage } from "./pages/RfxDetailPage.jsx";
import { SupplierListPage } from "./pages/SupplierListPage.jsx";
import { SupplierDetailPage } from "./pages/SupplierDetailPage.jsx";

function Placeholder({ label }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-text-secondary">
      <div className="text-center">
        <p className="text-h4 mb-sm">{label}</p>
        <p className="text-sm">Coming soon.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectListPage />} />
        <Route
          path="/projects/:projectId/bom"
          element={<BOMWorkspacePage />}
        />
        <Route
          path="/projects/:projectId/changes/new"
          element={<DesignChangeRequestPage />}
        />
        <Route
          path="/projects/:projectId/design"
          element={<Placeholder label="Design Workspace" />}
        />
        <Route
          path="/projects/:projectId/cost"
          element={<CostWorkspacePage />}
        />
        <Route
          path="/projects/:projectId/sourcing"
          element={<SourcingWorkspacePage />}
        />
        <Route
          path="/projects/:projectId/sourcing/rfx/:rfxId"
          element={<RfxDetailPage />}
        />
        <Route
          path="/projects/:projectId/quality"
          element={<Placeholder label="APQP Workspace" />}
        />
        <Route path="/items" element={<Placeholder label="Items" />} />
        <Route path="/suppliers" element={<SupplierListPage />} />
        <Route
          path="/suppliers/:supplierId"
          element={<SupplierDetailPage />}
        />
        <Route
          path="/categories"
          element={<Placeholder label="Categories" />}
        />
        <Route path="/ai" element={<Placeholder label="AI Workspace" />} />
        <Route path="*" element={<Placeholder label="Not Found" />} />
      </Route>
    </Routes>
  );
}
