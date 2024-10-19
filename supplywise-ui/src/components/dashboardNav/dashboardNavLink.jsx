import Link from "next/link";

export default function DashboardNavLink({ text , currentPage }) {
    var href = text.toLowerCase();
    href = "/dashboard";
    if (text !== "Home") {
        href += `/${text.toLowerCase()}`;
    }
    return (
        <li className="nav-item sw-bgcolor px-2">
            <div className="row">
                <div {...currentPage === href ? { className: "col-1 bg-dark" } : { className: "col-0" }}></div>
                <div {...currentPage === href ? { className: "col-11" } : { className: "col-12" }}>
                    <Link className="nav-link text-white" href={`${href}`}>
                        {text}
                    </Link>
                </div>
            </div>
        </li>
    );
}