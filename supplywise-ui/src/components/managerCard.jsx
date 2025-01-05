import { faEnvelope, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ManagerCard({ id, name, role, restaurant, email, getRoleName, deleteManager}) {


    return (
        <div className="col-4 pe-5 pb-4 pt-3">
            <div className="card">
                <div className="card-header">
                    <div className="row align-items-end">
                        <div className="col-6">
                            <h4 className="card-title m-0">
                                <strong>{name}</strong>
                            </h4>
                        </div>
                        <div className="col-6 text-end">
                            <button className="btn d-none sw-bgcolor me-1"><FontAwesomeIcon icon={faPencil} style={{ padding: ".05vw", width: "1vw" }}></FontAwesomeIcon></button>
                            <button onClick={() => deleteManager(name)} className="btn btn-dark  me-1"><FontAwesomeIcon icon={faTrash} style={{ padding: ".05vw", width: "1vw" }}></FontAwesomeIcon></button>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    {/* <p className="card-text"><b>{restaurant}</b></p> */}
                    <h6 className="card-title m-0 mb-1 text-muted">
                        {getRoleName(role)}
                    </h6>
                    <p className="card-text"><FontAwesomeIcon icon={faEnvelope} style={{ width: "1.2vw", marginRight: "0.5vw" }} /><a className="sw-color" href="mailto:email">{email}</a></p>
                </div>
            </div>
        </div>
    );
}