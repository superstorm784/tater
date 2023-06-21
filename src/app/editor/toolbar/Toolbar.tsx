import { useContext, useState } from "react";
import { Nav, NavDropdown, Navbar, NavbarBrand } from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";
import NavbarToggle from "react-bootstrap/esm/NavbarToggle";
import { useTranslation } from "react-i18next";
import "./Toolbar.scss";
import EditorContext from "../EditorContext";

function Toolbar() {
    const { t } = useTranslation();
    const { project } = useContext(EditorContext);
    const [ isHovering, setHover ] = useState(false);

    const onMouseEnter = () => setHover(true);
    const onMouseLeave = () => setHover(false);

    const exportProject = () => project?.triggerDownload();

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
                <NavDropdown title={t("editor:actions.file.main")} id="tt-toolbar-nav-file">
                    <NavDropdown.Item>{t("editor:actions.file.new")}</NavDropdown.Item>
                    <NavDropdown.Item>{t("editor:actions.file.load")}</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item 
                        onClick={exportProject}
                    >{t("editor:actions.file.export")}</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </NavbarCollapse>
    </Navbar>;
}

export default Toolbar;