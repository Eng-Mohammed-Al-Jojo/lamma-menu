import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AdminPage, MenuPage, CategoryItemsPage } from "./pages";
import { MenuProvider } from "./context/MenuContext";

export default function App() {
  const { t } = useTranslation();

  return (
    <MenuProvider>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/category/:id" element={<CategoryItemsPage />} />

        {/* fallback */}
        <Route
          path="*"
          element={
            <div className="text-white p-10 text-center font-bold">
              {t('common.not_found')}
            </div>
          }
        />
      </Routes>
    </MenuProvider>
  );
}
