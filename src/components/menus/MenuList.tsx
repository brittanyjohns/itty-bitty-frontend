import React, { useEffect, useState, useRef } from "react";
import { Menu, deleteMenu, getMenus } from "../../data/menus";
import { IonList, IonButton } from "@ionic/react";
import MenuListItem from "./MenuListItem";
import SignInScreen from "../../pages/auth/SignUpScreen";
import { useCurrentUser } from "../../hooks/useCurrentUser";
const MenuList = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [menuId, setMenuId] = useState<string>("");
  const [leaving, setLeaving] = useState<boolean>(false);
  const { currentUser, setCurrentUser } = useCurrentUser();

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
      <IonList className="w-full">
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
