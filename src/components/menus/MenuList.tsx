import { useEffect, useState, useRef } from "react";
import { Menu, getMenus } from "../../data/menus";
import { IonList, IonButton } from "@ionic/react";
import MenuListItem from "./MenuListItem";
import SignInScreen from "../../pages/auth/SignUpScreen";
import { useCurrentUser } from "../../hooks/useCurrentUser";
const MenuList = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const { currentUser } = useCurrentUser();

  const fetchMenus = async () => {
    const allMenus = await getMenus();
    if (!allMenus) {
      console.error("Error fetching menus");
      return;
    }
    console.log("allMenus", allMenus);
    const menus = allMenus;
    setMenus(menus);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <div className="w-full p-2">
      <IonList className="w-full md:w-3/4 lg:w-1/2 mx-auto">
        {menus?.map((menu, index) => (
          <MenuListItem key={index} menu={menu} />
        ))}
        {currentUser && menus?.length === 0 && (
          <div className="text-center">
            <p>No menus found</p>
            <IonButton routerLink="/menus/new" color="primary">
              Create a new menu
            </IonButton>
          </div>
        )}

        {!currentUser && <SignInScreen />}
      </IonList>
    </div>
  );
};

export default MenuList;
