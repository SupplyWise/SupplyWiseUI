import { faFileInvoiceDollar, faWarehouse, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SidebarLink({ text, currentPage, selectedRestaurant }) {
    const router = useRouter(); // Get the current route

    let href = "/management";
    if (text !== "Dashboard") {
        href += `/${text.toLowerCase()}`;
    }

    const restaurantSections = [
        { name: "inventory", icon: faWarehouse },
        { name: "reports", icon: faFileInvoiceDollar },
        { name: "team", icon: faUsers },
    ];

    const isActive = (path) => router.pathname === path; // Check if current route matches

    return (
        <>
            <li className="nav-item">
                <div className="row my-0">
                    <div className="col-12">
                        <Link
                            className={`text-black nav-link ${isActive(href) ? "active" : ""}`}
                            href={href}
                        >
                            {text}
                        </Link>
                    </div>
                </div>
            </li>
            {text === "Restaurants" && selectedRestaurant && (
                <>
                    <div className="row pb-0 m-0">
                        <div className="col-12 sw-bgcolor-static p-0">
                            <span className="nav-item text-white fs-5 text-uppercase text-center">
                                {selectedRestaurant}
                            </span>
                        </div>
                    </div>
                    <div className="row pb-0 m-0">
                        <div className="col-12 ms-4 ps-0">
                            {restaurantSections.map((section, index) => {
                                const sectionHref = `${href}/${section.name}`;
                                return (
                                    <li key={index} className="nav-item m-0 text-black">
                                        <div className="row align-items-center">
                                            <Link
                                                className={`nav-link border-start border-1 border-dark-subtle restaurant-section-nav text-start text-uppercase fs-6 d-flex align-items-center ${isActive(sectionHref) ? "active" : ""
                                                    }`}
                                                href={sectionHref}
                                            >
                                                <FontAwesomeIcon
                                                    icon={section.icon}
                                                    style={{
                                                        width: "1.2vw",
                                                        marginRight: "0.5vw",
                                                    }}
                                                />
                                                {section.name}
                                            </Link>
                                        </div>
                                    </li>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
            <hr className="my-0" />
        </>
    );
}
