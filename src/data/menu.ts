export interface MenuLink {
  endpoint: string;
  name: string;
  id: number;
}

const menuLinks: MenuLink[] = [
  {
    endpoint: '/boards/new',
    name: 'New Board',
    id: 0
  },
  {
    endpoint: '/images/new',
    name: 'New Image',
    id: 1
  },
  {
    endpoint: '/images',
    name: 'Images',
    id: 2
  },
  {
    endpoint: '/boards',
    name: 'Boards',
    id: 3
  }
];

export const getMenu = () => menuLinks;

export const getMenuLink = (id: number) => menuLinks.find(m => m.id === id);
