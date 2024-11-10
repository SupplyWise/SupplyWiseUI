
import DashboardLayout from "@/components/managementLayout";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { API_URL } from "../../../../api_url";

export default function Restaurants() {

    const reports = [
        {
            id: 1,
            dateStart: "2024-01-01",
            dateEnd: "2024-01-31",
            numProducts: 10,
            closedBy: "John Doe",
        },
        {
            id: 2,
            dateStart: "2024-02-01",
            dateEnd: "2024-02-28",
            numProducts: 10,
            closedBy: "John Doe",
        },
        {
            id: 3,
            dateStart: "2024-03-01",
            dateEnd: "2024-03-31",
            numProducts: 10,
            closedBy: "Mary Jane",
        },
        {
            id: 4,
            dateStart: "2024-04-01",
            dateEnd: "2024-04-30",
            numProducts: 10,
            closedBy: "Mary Jane",
        },
        {
            id: 5,
            dateStart: "2024-05-01",
            dateEnd: "2024-05-31",
            numProducts: 10,
            closedBy: "Mary Jane",
        },
        {
            id: 6,
            dateStart: "2024-06-01",
            dateEnd: "2024-06-30",
            numProducts: 10,
            closedBy: "Mary Jane",
        },
        {
            id: 7,
            dateStart: "2024-07-01",
            dateEnd: "2024-07-31",
            numProducts: 10,
            closedBy: "Mary Jane",
        },
        {
            id: 8,
            dateStart: "2024-08-01",
            dateEnd: "2024-08-31",
            numProducts: 10,
            closedBy: "Mary Jane",
        },
        {
            id: 9,
            dateStart: "2024-09-01",
            dateEnd: "2024-09-30",
            numProducts: 10,
            closedBy: "John Doe",
        },
        {
            id: 10,
            dateStart: "2024-10-01",
            dateEnd: "2024-10-31",
            numProducts: 10,
            closedBy: "John Doe",
        },
        {
            id: 11,
            dateStart: "2024-11-01",
            dateEnd: "2024-11-30",
            numProducts: 10,
            closedBy: "John Doe",
        },
        {
            id: 12,
            dateStart: "2024-12-01",
            dateEnd: "2024-12-31",
            numProducts: 10,
            closedBy: "John Doe",
        },
    ]

    var closers = []
    reports.map((report) => {
        if (!closers.includes(report.closedBy)) {
            closers.push(report.closedBy)
        }
    })

    const [dateStart, setDateStart] = useState('')
    const [dateEnd, setDateEnd] = useState('')
    const [closedBy, setClosedBy] = useState('')
    const [inventories, setInventories] = useState([])

    useEffect(() => {
        fetch(`${API_URL}/inventories/restaurant/${JSON.parse(sessionStorage.getItem('selectedRestaurant')).id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
            }
        })
            .then(response => {
                if (!response.ok) {
                    console.error('Failed to fetch inventories');
                    return;
                }
                if (response.status === 204) {
                    console.error('No inventories found');
                    return;
                }
                return response.json()
            })
            .then(data => {
                setInventories(data)
            })
    }, [])



    return (
        <DashboardLayout>
            <div style={{ padding: '20px' }}>
                <div className="content">
                    <div className='mt-3 row'>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <label style={{ width: '200%' }} className='form-label'>Filter by Date Interval</label>
                                <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} className='form-control' />
                                <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} className='form-control' />
                                <button className='btn sw-bgcolor ms-2' onClick={() => { setDateStart(''); setDateEnd('') }}>Clear</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <label style={{ width: '200%' }} className='form-label'>Closed By</label>
                                <select className='form-select' onChange={(e) => setClosedBy(e.target.value)}>
                                    <option selected value=''>All</option>
                                    {closers.map((closer) => (
                                        <option value={closer}>{closer}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <table className="table table-striped mt-4" style={{ border: '2px solid black' }}>
                            <thead>
                                <tr>
                                    <th scope="col">Date Start</th>
                                    <th scope="col">Date Close</th>
                                    <th scope="col">Number of Products</th>
                                    <th scope="col">Closed By</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventories === undefined ?
                                    <tr><td colSpan='5'>No inventories found</td></tr> :
                                    <>
                                        {inventories
                                            .filter(inventory =>
                                                inventory.closingDate !== null &&
                                                (dateStart === '' || inventory.emissionDate >= dateStart) &&
                                                (dateEnd === '' || inventory.closingDate <= dateEnd)
                                                // && (closedBy === '' || inventory.closedBy === closedBy)
                                            )
                                            .map((inventory) => (
                                                <tr key={inventory.id}>
                                                    <td>{inventory.emissionDate.split('T')[0]}</td>
                                                    <td>{inventory.closingDate.split('T')[0]}</td>
                                                    <td>{inventory.itemStocks.length}</td>
                                                    <td>{null}</td>
                                                    <td>
                                                        <button className='btn btn-success ms-2'>
                                                            <FontAwesomeIcon style={{ width: '.9vw' }} icon={faDownload} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
