import React, { useEffect, useState } from 'react';
import { navbarStyles } from '../assets/dummyStyles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BaggageClaim, Clock, Menu, User, User2, X } from 'lucide-react';
import { useCart } from '../CartContext'; // if you have it

const Navbar = () => {
    const { totalItems, clearCart, reloadCart } = useCart(); // TEMP: comment if not ready

    const [open, setOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(() => {
        try {
            return (
                localStorage.getItem("isLoggedIn") === "true" ||
                !!localStorage.getItem("authToken")
            );
        } catch {
            return false;
        }
    });

    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState(location.pathname || '/');

    useEffect(() => {
        setActive(location.pathname || '/');
    }, [location]);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "isLoggedIn" || e.key === "authToken") {
                setLoggedIn(
                    localStorage.getItem("isLoggedIn") === "true" ||
                    !!localStorage.getItem("authToken")
                );
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Watches", href: "/watches" },
        { name: "Contact", href: "/contact" },
        { name: "My orders", href: "/my-orders"}
    ];

    const handleNavClick = (href) => { setActive(href); setOpen(false); }

    useEffect(()=>{
        try {
            reloadCart()
        } catch (error) {
            
        }
    },[loggedIn])

    const handleLogout = () => {
        try {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            localStorage.removeItem("cart");
            localStorage.removeItem("cartItems");

        } catch (error) {

        }
        try {
            clearCart && clearCart()
            
        } catch (error) {
            
        }
        setLoggedIn(false);
        setOpen(false)
        navigate("/");
    };

    return (
        <header className={navbarStyles.header}>
            <nav className={navbarStyles.nav} role='navigation'>
                <div className={navbarStyles.container}>
                    <div className={navbarStyles.brandContainer}>
                        <div className={navbarStyles.logoContainer}>
                            <Clock className={navbarStyles.logoIcon} />
                        </div>
                        <Link to='/' onClick={() => handleNavClick('/')} className={navbarStyles.logoLink}>
                            <span style={navbarStyles.logoTextStyle} className={navbarStyles.logoText}>
                                TimeStore
                            </span>
                        </Link>
                    </div>
                    <div className={navbarStyles.desktopNav}>
                        {navItems.map((item) => {

                            const isActive = active === item.href;

                            return (
                                <Link key={item.name} to={item.href} onClick={() => { handleNavClick(item.href) }} className={`${navbarStyles.navItemBase} ${isActive ? navbarStyles.navItemActive : navbarStyles.navItemInactive}`}>
                                    <span>{item.name}</span>
                                    <span className={`${navbarStyles.activeIndicator} ${isActive ? navbarStyles.activeIndicatorVisible : navbarStyles.activeIndicatorHidden}`}></span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className={navbarStyles.rightActions}>
                        <Link to='/cart' className={navbarStyles.cartLink}>
                            <BaggageClaim className={navbarStyles.cartIcon} />
                            {totalItems > 0 && (
                                <span className={navbarStyles.cartBadge}>{totalItems}</span>
                            )}
                        </Link>

                        {!loggedIn ? (
                            <Link to='/login' className={navbarStyles.accountLink}>
                                <User className={navbarStyles.accountIcon} />
                                <span className={navbarStyles.accountText}>Account</span>
                            </Link>
                        ) : (
                            <button onClick={handleLogout} className={navbarStyles.accountLink}>
                                <User className={navbarStyles.accountIcon} />
                                <span className={navbarStyles.accountText}>Logout</span>
                            </button>
                        )}

                        <div className={navbarStyles.mobileMenuButton}>
                            <button onClick={() => setOpen(!open)} className={navbarStyles.menuButton}>
                                {
                                    open ?
                                        (
                                            <X className={navbarStyles.menuIcon} />
                                        ) : (
                                            <Menu className={navbarStyles.menuIcon} />
                                        )
                                }
                            </button>
                        </div>
                    </div>
                </div>
                {open && (
                    <div className={navbarStyles.mobileMenu}>
                        <div className={navbarStyles.mobileMenuContainer}>
                            {navItems.map((item) => {
                                const isActive = active === item.href;
                                return (
                                    <Link key={item.name} to={item.href} onClick={() => handleNavClick(item.href)} className={`${navbarStyles.mobileNavItemBase} ${isActive
                                        ? navbarStyles.mobileNavItemActive
                                        : navbarStyles.mobileNavItemInactive}`}>
                                        <span className={navbarStyles.mobileNavItemText}>
                                            {item.name}
                                        </span>
                                    </Link>

                                )
                            })}
                            <div className={navbarStyles.mobileAccountContainer}>
                                {!loggedIn ? (
                                    <Link to='/login' onClick={() => {
                                        setOpen(false);
                                        handleNavClick('/login')
                                    }} className={navbarStyles.mobileAccountLink}>
                                        <User className={navbarStyles.mobileAccountIcon} />
                                        <span>Account</span>
                                    </Link>
                                ) : (
                                    <button onClick={handleLogout} className={navbarStyles.mobileAccountButton}>
                                        <User className={navbarStyles.mobileAccountIcon} />
                                        <span>Logout</span>
                                    </button>

                                )

                                }
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;





