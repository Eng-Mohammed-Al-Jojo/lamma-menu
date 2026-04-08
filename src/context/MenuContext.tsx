import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { MenuService, type MenuData } from "../services/menuService";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

interface MenuContextType {
  menuData: MenuData | null;
  isLoading: boolean;
  hasLoaded: boolean;
  hasFeaturedItems: boolean;
  complaintsWhatsapp: string;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasFeaturedItems, setHasFeaturedItems] = useState(false);
  const [complaintsWhatsapp, setComplaintsWhatsapp] = useState("");

  useEffect(() => {
    let unsubscribeMenu: (() => void) | null = null;

    const initMenu = async () => {
      try {
        const { data } = await MenuService.getMenuWithFallback();
        setMenuData(data);
        setHasFeaturedItems(data.items.some(item => item.star === true && item.visible !== false));
        setHasLoaded(true);
        setIsLoading(false);

        // Subscribe to live updates
        unsubscribeMenu = MenuService.subscribeToMenuUpdates((freshData) => {
          setMenuData(freshData);
          setHasFeaturedItems(freshData.items.some(item => item.star === true && item.visible !== false));
        });
      } catch (err) {
        console.error("Menu Context initialization failed:", err);
        setIsLoading(false);
      }
    };

    initMenu();

    // Complaints Whatsapp fetch
    const complaintsRef = ref(db, "settings/complaintsWhatsapp");
    const unsubComplaints = onValue(complaintsRef, (snapshot) => {
      const value = snapshot.val();
      setComplaintsWhatsapp(value ? String(value).trim() : "");
    });

    return () => {
      if (unsubscribeMenu) unsubscribeMenu();
      unsubComplaints();
    };
  }, []);

  return (
    <MenuContext.Provider value={{ menuData, isLoading, hasLoaded, hasFeaturedItems, complaintsWhatsapp }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
