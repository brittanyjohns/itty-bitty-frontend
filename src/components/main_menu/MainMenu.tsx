import React, { useCallback, useEffect, useState } from "react";
import { MenuLink } from "../../data/menu";
import SideMenu from "./SideMenu";
import { getFilterList } from "../../data/utils";
import { useHistory } from "react-router";
import "../../components/main.css";

import { closeMainMenu } from "../../pages/MainHeader";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface MainMenuProps {
  isWideScreen?: boolean;
  currentUser?: any;
  currentAccount?: any;
  pageTitle?: string;
}

const MainMenu: React.FC<MainMenuProps> = (props) => {
  const [filteredLinks, setFilteredLinks] = useState<MenuLink[]>([]);
  const history = useHistory();
  const filteredList = getFilterList();
  const { currentUser, currentAccount } = useCurrentUser();

  useEffect(() => {
    console.log("currentUser", currentUser);
    console.log("filteredLinks", filteredLinks);
    const t = getFilterList(currentUser, currentAccount);
    console.log("t", t);
  }, []);

  return (
    <>
      <SideMenu currentUser={currentUser} currentAccount={currentAccount} />
    </>
  );
};

export default MainMenu;
