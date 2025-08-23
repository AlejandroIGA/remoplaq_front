import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, ConfigProvider } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const SideBar = () => {
  const location = useLocation();

  const purchasesGroup = {
    key: 'comprasGroup',
    label: 'Compras',
    children: [
        {
            key: 'compras',
            label: <Link to="/compras">Compras</Link>,
        },
        {
            key: 'requerimientos',
            label: <Link to="/requerimientos">Requerimientos</Link>,
        },
        {
            key: 'cotizaciones',
            label: <Link to="/cotizaciones">Cotizaciones</Link>,
        },
        {
            key: 'proveedores',
            label: <Link to="/proveedores">Proveedores</Link>,
        },
        {
            key: 'materiales',
            label: <Link to="/materiales">Materiales</Link>,
        }
    ]
  };

  const items = [
    purchasesGroup 
  ];

  return (
    <ConfigProvider
            theme={{
                token: {
                },
                components: {
                    Menu: {
                        colorPrimary: "#2B221A", //Color del texto en Hover
                        itemActiveBg: "none", //Color al presionar sobre una opción
                        itemBg: "#DDD5C8", //Color de todo el menu
                        itemColor: "#2B221A", //Color del texto por defecto
                        itemHoverBg: "#F1B43E", //Color de hover sobre item
                        itemSelectedBg: "#transparent", //Color cuando está seleccionado
                        itemSelectedColor: "##2B221A", //Color del texto cuando está seleccionado
                        iconSize: 32,
                        fontSize: 24,
                        itemMarginBlock: 10,
                        iconMarginInlineEnd: 10,
                        fontFamily: "Inter, sans-serif"
                    }
                }
            }}
        >
            <div style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}>
                <Menu
                    mode="inline"
                    inlineCollapsed={false}
                    items={items}
                    style={{ height: "100%"}}
                />
            </div>
        </ConfigProvider>
  );
};
export default SideBar;
