import React, { useCallback, useEffect, useState } from "react";
import { MenuLink } from "../../data/menu";
import SideMenu from "./SideMenu";
import { getFilterList } from "../../data/utils";
import { useHistory } from "react-router";
import "../../components/main.css";

import { closeMainMenu } from "../../pages/MainHeader";

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
  const { currentUser, currentAccount } = props;
  const filterList = useCallback(() => {
    return getFilterList(currentUser, currentAccount);
  }, [currentUser, currentAccount]);

  useEffect(() => {
    const filtered = filterList();
    setFilteredLinks(filtered);
  }, [filterList]);

  const setUpMenu = useCallback(() => {
    setFilteredLinks(filteredList ?? []);
  }, []);

  useEffect(() => {
    setUpMenu();
  }, [setUpMenu]);

  const goToDashboard = () => {
    closeMainMenu();
    history.push("/home");
  };

  return (
    <>
      <SideMenu
        filteredLinks={filteredLinks}
        currentUser={currentUser}
        goToDashboard={goToDashboard}
      />
    </>
  );
};

export default MainMenu;
