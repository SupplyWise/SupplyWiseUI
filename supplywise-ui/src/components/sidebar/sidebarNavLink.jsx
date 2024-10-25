import { faFileInvoiceDollar, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function DashboardNavLink({ text, currentPage, selectedRestaurant }) {
    var href = text.toLowerCase();
    href = "/management";
    if (text !== "Dashboard") {
        href += `/${text.toLowerCase()}`;
    }

    const restaurantSections = [
        { name: "inventory", icon: faWarehouse },
        { name: "reports", icon: faFileInvoiceDollar },
    ];

    return (
        <>
            <li className="nav-item sw-bgcolor px-2">
                <div className="row">
                    <div {...currentPage === href || (currentPage.includes("restaurants") && href.includes("restaurants")) ? { className: "col-1 bg-dark" } : { className: "col-0" }}></div>
                    <div {...currentPage === href || (currentPage.includes("restaurants") && href.includes("restaurants")) ? { className: "col-11" } : { className: "col-12" }}>
                        <Link className="nav-link text-white" href={`${href}`}>
                            {text}
                        </Link>
                    </div>
                </div>
            </li>
            {text === "Restaurants" && selectedRestaurant &&
                <>
                    <li className="nav-item bg-dark px-2">
                        <div className="row">
                            <span className="text-white text-start p-2 fs-6 text-uppercase">{selectedRestaurant}</span>
                        </div>
                    </li>
                    {restaurantSections.map((section, index) => (
                        <li key={index} className="nav-item bg-dark px-2">
                            <div className="row">
                                <Link className="nav-link restaurant-section-nav text-end text-uppercase fs-6" href={`${href}/${section.name}`}>
                                    {section.name}
                                    <FontAwesomeIcon icon={section.icon} style={{ width: '1vw', marginLeft:'0.5vw' }} />
                                </Link>
                            </div>
                        </li>
                    ))
                    }
                </>
            }
        </>

    );
}