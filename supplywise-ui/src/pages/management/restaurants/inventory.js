import React, { useEffect, useState } from 'react';

import DashboardLayout from "@/components/managementLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../../../api_url';

export default function Inventory() {

    const [inventoryOngoing, setInventoryOngoing] = useState(null);
    const [textFilter, setTextFilter] = useState('');
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/inventories/restaurant/${JSON.parse(sessionStorage.getItem('selectedRestaurant')).id}/open`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
            }
        })
            .then((response) => {
                if (response.status === 204) {
                    return;
                }

                return response.text();
            })
            .then((data) => {
                if (!data) {
                    setInventoryOngoing(null);
                    return;
                }
                setInventoryOngoing(JSON.parse(data)[0]);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);


    useEffect(() => {
        let productsInit = [
            {
                barCodeNumber: '123456789012',
                id: 1,
                name: 'water',
                category: 'drinks',
                expirationDate: new Date(),
                quantity: 10,
                un: 'kg',
            },
            {
                barCodeNumber: '452454545454',
                id: 2,
                name: 'bread',
                category: 'food',
                expirationDate: new Date(),
                quantity: 20,
                un: 'kg',
            },
            {
                barCodeNumber: '498874545454',
                id: 3,
                name: 'pork',
                category: 'meat',
                expirationDate: new Date(),
                quantity: 30,
                un: 'kg',
            },
            {
                id: 4,
                name: 'lettuce',
                category: 'vegetables',
                expirationDate: new Date(),
                barCodeNumber: '498874545123',
                quantity: 40,
                un: 'kg',
            },
        ];
        setProducts(productsInit);
    }, []);

    const startInventory = () => {
        let startDate = document.getElementById('startDate').value;
        if (startDate === '') {
            startDate = new Date().toISOString().split('T')[0];
        }
        startDate += 'T00:00:00.000Z';

        let endDate = document.getElementById('endDate').value;
        if (endDate === '') {
            endDate = null;
        } else {
            endDate += 'T23:59:59.999Z';
        }

        let restaurantId = JSON.parse(sessionStorage.getItem('selectedRestaurant')).id;

        fetch(`${API_URL}/inventories/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
            },
            body: JSON.stringify({ emissionDate: startDate, expectedClosingDate: endDate, restaurantId: restaurantId }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to start inventory');
                }
                return response.json();
            })
            .then((inventory) => {
                setInventoryOngoing(inventory);
            })
            .catch((error) => console.error(error));
    };

    const addProduct = () => {
        console.log('Add Product');
        setIsAddProductModalOpen(true);
    }

    const removeProduct = (id) => {
        console.log('Remove Product', id);
    }

    const editProduct = (id) => {
        console.log('Edit Product', id);
    }

    const addNewProduct = () => {
        let barCodeNumber = document.getElementById('barCodeNumber').value;
        let quantity = document.getElementById('quantity').value;
        let expirationDate = document.getElementById('expirationDate').value;
        let priceByUn = Math.floor(Math.random() * 100);
        let newProduct = {
            barCodeNumber: barCodeNumber,
            id: products.length + 1,
            name: 'product' + parseInt(products.length + 1),
            category: 'the category',
            expirationDate: new Date(),
            priceByUn: priceByUn,
            quantity: quantity,
            un: 'kg',
            totalPrice: priceByUn * quantity
        };
        setProducts([...products, newProduct]);
        setIsAddProductModalOpen(false);
    }

    const endInventory = () => {
        console.log('End Inventory');
        setInventoryOngoing(false);
        setProducts([]);
    }


    return (
        <DashboardLayout>
            <div style={{ padding: '20px' }}>
                <div className="content">
                    {inventoryOngoing ? (
                        <div className='row'>
                            <div className='col-9'>
                                <h1 className='text-center'  > Inventory in Progress</h1>
                                <div className='mt-3 row'>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <input type="text" placeholder='Search' onChange={(e) => setTextFilter(e.target.value)} />
                                        <button className='btn sw-bgcolor' onClick={() => addProduct()}>Add Product</button>
                                    </div>
                                    <table className="table table-striped mt-4" style={{ border: '2px solid black' }}>
                                        <thead>
                                            <tr>
                                                <th scope="col">Bar Code Number</th>
                                                <th scope="col">Product Name</th>
                                                <th scope="col">Category</th>
                                                <th scope="col">Expiration Date</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Unit</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inventoryOngoing.itemStocks
                                                .filter(product =>
                                                    product.name.toLowerCase().includes(textFilter.toLowerCase()) ||
                                                    product.category.toLowerCase().includes(textFilter.toLowerCase()) ||
                                                    product.barCodeNumber.includes(textFilter)
                                                )
                                                .map((product) => (
                                                    <tr key={product.id}>
                                                        <td>{product.barCodeNumber}</td>
                                                        <td>{product.name}</td>
                                                        <td>{product.category}</td>
                                                        <td>{product.expirationDate.toISOString().split('T')[0]}</td>
                                                        <td>{product.quantity}</td>
                                                        <td>{product.un}</td>
                                                        <td>
                                                            <button className='btn btn-danger' onClick={() => removeProduct(product.id)}>
                                                                <FontAwesomeIcon style={{ width: '.9vw' }} icon={faTrash} />
                                                            </button>
                                                            <button className='btn btn-primary ms-2' onClick={() => editProduct(product.id)}>
                                                                <FontAwesomeIcon style={{ width: '.9vw' }} icon={faPencil} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='col-3'>
                                <div className='bg-dark text-white p-3 ms-5' style={{ height: '100%', width: '125%', borderRadius: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <h4 className='text-center'>Inventory Details</h4>
                                    <h6 className='mb-4 text-center text-secondary'>({inventoryOngoing.itemStocks.length} products)</h6>
                                    <div className='text-end mt-2'>
                                        <h6><span className='fw-bold'>Starting Date:</span> {inventoryOngoing.emissionDate.split('T')[0]}</h6>
                                        <h6><span className='fw-bold'>Closing Date:</span> {inventoryOngoing.expectedClosingDate === null ? 'Not Defined' : inventoryOngoing.expectedClosingDate.split('T')[0]}</h6>
                                    </div>
                                    <div className="d-flex flex-column align-items-center mt-4">
                                        <div className='row w-75'>
                                            <button className='btn btn-success mb-2'>Import Inventory <FontAwesomeIcon style={{ width: '1rem' }} icon={faFileExcel} /> </button>
                                        </div>
                                        <div className='row w-75'>
                                            <button className='btn btn-secondary' onClick={() => endInventory()} >End Inventory</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div>
                            <div>
                                <h1 className='text-center' > No Inventory Ongoing</h1>
                                <div className='mt-5' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                    <div style={{ display: 'flex', width: '70%', justifyContent: 'space-between', flexDirection: 'row' }}>
                                        <div>
                                            <label htmlFor="date">Starting Date</label>
                                            <input type="date" id="startDate" name="date" />
                                        </div>
                                        <div>
                                            <label htmlFor="date">Expected Closing Date</label>
                                            <input type="date" id="endDate" name="date" />
                                        </div>
                                        <div>
                                            <button className='btn sw-bgcolor' onClick={() => startInventory()}>Start Inventory</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {
                isAddProductModalOpen && (
                    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Add Product</h5>
                                    <button type="button" className="btn-close" onClick={() => setIsAddProductModalOpen(false)} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="row">
                                            <div className='col-9'>
                                                <label htmlFor="barCodeNumber" className="form-label">Bar Code Number</label>
                                                <input type="text" className="form-control" id="barCodeNumber" />
                                            </div>
                                            <div className='col-3'>
                                                <label htmlFor="quantity" className="form-label">Quantity</label>
                                                <input type="number" className="form-control" id="quantity" />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className='col-12'>
                                                <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
                                                <input type="date" className="form-control" id="expirationDate" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsAddProductModalOpen(false)}>Close</button>
                                    <button type="button" className="btn sw-bgcolor" onClick={() => addNewProduct()}>Add Product</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </DashboardLayout>
    );
}
