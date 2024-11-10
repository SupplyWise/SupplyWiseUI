import { faFileInvoiceDollar, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function SidebarLink({ text, currentPage, selectedRestaurant }) {
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
            <li className="nav-item px-2">
                <div className="row my-0">
                    <div {...currentPage === href || (currentPage.includes("restaurants") && href.includes("restaurants")) ? { className: "col-1 sw-bgcolor" } : { className: "col-1 bg-light" }}></div>
                    <div className="col-11" style={{ paddingRight: "10%" }}>
                        <Link className="nav-link text-black gray-hover" href={`${href}`}>
                            {text}
                        </Link>
                    </div>
                </div>
            </li>
            {text === "Restaurants" && selectedRestaurant &&
                <>
                    <div className="row mb-0 pb-0">
                        <div className="col-2 sw-bgcolor"></div>
                        <div className="col-10" style={{marginLeft: "0px", marginRight: "0px", paddingLeft:"0px"}}>
                            <li className="nav-item sw-bgcolor px-2">
                                <div className="row">
                                    <span className="text-white fs-5 text-uppercase text-center">{selectedRestaurant}</span>
                                </div>
                            </li>
                            {restaurantSections.map((section, index) => (
                                <li key={index} className="nav-item px-2 text-black">
                                    <div className="row">
                                        <Link className="nav-link restaurant-section-nav text-start text-uppercase fs-6" href={`${href}/${section.name}`}>
                                            <FontAwesomeIcon icon={section.icon} style={{ width: '1vw', marginRight: '0.5vw' }} />
                                            {section.name}
                                        </Link>
                                    </div>
                                </li>
                            ))
                            }
                        </div>
                    </div>

                </>
            }
            <hr className="my-0" />
        </>

    );
}