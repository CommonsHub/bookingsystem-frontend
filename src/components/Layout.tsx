
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";

const Layout = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto pt-4 pb-32 px-4 sm:px-6 max-w-6xl">
        <Outlet />
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span>© {new Date().getFullYear()} {t('footer.copyright')}</span>
            <a 
              href="https://github.com/CommonsHub/bookingsystem-frontend/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              Help improve this site
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
