import React from 'react';
import Logo from "../../assets/Logo.jpg"
import './index.scss';

const Header = () => {
    return (
        <div className="app-header">
            <img src= {Logo} alt= "logo" className= "app-header__logo"/>
        </div>
    )
}

export default Header;