import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { IconContext } from 'react-icons/lib';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background: #252831;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #414757;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;

  &:hover {
    background: #632ce4;
    cursor: pointer;
  }
`;

const Nav = styled.div`
  background: #15171c;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  padding-right:20px;
  padding-bottom:20px;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items:flex-start;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: left 0.4s ease-in-out;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav);
  const showSidebar = () => setSidebar(!sidebar);

  const hardcodedSidebarData = [
    {
      title: 'Dashboard',
      path: '/',
      icon: <AiIcons.AiFillHome />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
    },
    {
      title: 'Prediction & Comparitive Analysis',
      path: '/kpi',
      icon: <IoIcons.IoIosPaper />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
    },
    {
      title: 'Analytics and KPIs',
      path: '/inventory',
      icon: <FaIcons.FaChartLine />
    },
    {
      title: 'Data Management',
      path: '/management',
      icon: <FaIcons.FaCartPlus />
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <IoIcons.IoMdHelpCircle />
    }
  ];

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
          <NavIcon to='#'>
            <FaIcons.FaBars color='#050505' onClick={showSidebar} />
          </NavIcon>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to='#'>
              <AiIcons.AiOutlineClose onClick={showSidebar} />
            </NavIcon>
            {hardcodedSidebarData.map((item, index) => {
              return (
                <>
                <SidebarLink 
                  to={item.path} 
                  onClick={() => {
                    showSidebar(); // Close the sidebar
                    item.subNav && showSubnav(); // Toggle subnav if it exists
                  }}>
                    <div>
                      {item.icon}
                      <SidebarLabel>{item.title}</SidebarLabel>
                    </div>
                    <div>
                      {item.subNav && subnav
                        ? item.iconOpened
                        : item.subNav
                        ? item.iconClosed
                        : null}
                    </div>
                </SidebarLink>

                </>
              );
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;