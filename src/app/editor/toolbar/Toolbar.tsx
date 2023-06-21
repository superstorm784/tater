import { useState } from "react";
import "./Toolbar.scss";
import { Nav, NavDropdown, Navbar, NavbarBrand } from "react-bootstrap";
import NavbarToggle from "react-bootstrap/esm/NavbarToggle";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";

function Toolbar() {
    const [ isHovering, setHover ] = useState(false);

    const onMouseEnter = () => setHover(true);
    const onMouseLeave = () => setHover(false);

    return <Navbar className="tt-toolbar bg-primary px-3 py-2">
        <NavbarBrand className="p-0 m-0 me-2">
            <img
                className="tt-logo"
                src={`${process.env.PUBLIC_URL}/${isHovering ? "logo-alt" : "logo"}.svg`}
                alt="Tater logo"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
        </NavbarBrand>
        <NavbarToggle aria-controls="tt-toolbar-nav" />
        <NavbarCollapse id="tt-toolbar-nav">
            <Nav>
                <NavDropdown title="File" id="tt-toolbar-nav-file">
                    <NavDropdown.Item>New project</NavDropdown.Item>
                    <NavDropdown.Item>Open project...</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </NavbarCollapse>
    </Navbar>;
}

export default Toolbar;