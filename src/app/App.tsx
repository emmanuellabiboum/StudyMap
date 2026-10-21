import { HashRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ScholarshipsPage from "./pages/ScholarshipsPage";
import GuidesPage from "./pages/GuidesPage";
import UniversitiesPage from "./pages/UniversitiesPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/universities" element={<UniversitiesPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
