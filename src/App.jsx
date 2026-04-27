import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layouts/AppShell.jsx";
import { ProjectLayout } from "./layouts/ProjectLayout.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { BOMWorkspacePage } from "./pages/BOMWorkspacePage.jsx";
import { ProjectListPage } from "./pages/ProjectListPage.jsx";
import { CostWorkspacePage } from "./pages/CostWorkspacePage.jsx";
import { DesignChangeRequestPage } from "./pages/DesignChangeRequestPage.jsx";
import { SourcingWorkspacePage } from "./pages/SourcingWorkspacePage.jsx";
import { RfxDetailPage } from "./pages/RfxDetailPage.jsx";
import { SupplierListPage } from "./pages/SupplierListPage.jsx";
import { SupplierDetailPage } from "./pages/SupplierDetailPage.jsx";
import { ItemListPage } from "./pages/ItemListPage.jsx";
import { CategoryListPage } from "./pages/CategoryListPage.jsx";
import { CategoryDetailPage } from "./pages/CategoryDetailPage.jsx";
import { AIWorkspacePage } from "./pages/AIWorkspacePage.jsx";
import { APQPWorkspacePage } from "./pages/APQPWorkspacePage.jsx";
import { DesignWorkspacePage } from "./pages/DesignWorkspacePage.jsx";
import { BOMVersionComparePage } from "./pages/BOMVersionComparePage.jsx";
import { ProjectOverviewPage } from "./pages/ProjectOverviewPage.jsx";
import { ProjectFilesPage } from "./pages/ProjectFilesPage.jsx";
import { ProjectMembersPage } from "./pages/ProjectMembersPage.jsx";
import { ProjectActivityPage } from "./pages/ProjectActivityPage.jsx";

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

        {/* Project workspace — shared layout with tab navigation */}
        <Route path="/projects/:projectId" element={<ProjectLayout />}>
          <Route index element={<ProjectOverviewPage />} />
          <Route path="bom" element={<BOMWorkspacePage />} />
          <Route path="bom/compare" element={<BOMVersionComparePage />} />
          <Route path="design" element={<DesignWorkspacePage />} />
          <Route path="cost" element={<CostWorkspacePage />} />
          <Route path="sourcing" element={<SourcingWorkspacePage />} />
          <Route
            path="sourcing/rfx/:rfxId"
            element={<RfxDetailPage />}
          />
          <Route path="quality" element={<APQPWorkspacePage />} />
          <Route path="changes/new" element={<DesignChangeRequestPage />} />
          <Route path="files" element={<ProjectFilesPage />} />
          <Route path="members" element={<ProjectMembersPage />} />
          <Route path="activity" element={<ProjectActivityPage />} />
        </Route>

        <Route path="/items" element={<ItemListPage />} />
        <Route path="/suppliers" element={<SupplierListPage />} />
        <Route
          path="/suppliers/:supplierId"
          element={<SupplierDetailPage />}
        />
        <Route path="/categories" element={<CategoryListPage />} />
        <Route path="/categories/:slug" element={<CategoryDetailPage />} />
        <Route path="/ai" element={<AIWorkspacePage />} />
        <Route path="*" element={<Placeholder label="Not Found" />} />
      </Route>
    </Routes>
  );
}
