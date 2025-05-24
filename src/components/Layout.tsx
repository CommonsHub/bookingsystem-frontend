
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useTranslation } from "react-i18next";

const Layout = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 max-w-6xl">
        <Outlet />
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} {t('footer.copyright')}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
