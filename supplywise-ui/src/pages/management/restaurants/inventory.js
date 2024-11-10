import React, { useEffect, useState } from 'react';

import DashboardLayout from "@/components/managementLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../../../api_url';
import fa from 'fontawesome';

export default function Inventory() {

    const [inventoryOngoing, setInventoryOngoing] = useState(null);
    const [textFilter, setTextFilter] = useState('');
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [newItemStockFieldsVisible, setNewItemStockFieldsVisible] = useState(false);
    const [isItemAlreadyCreated, setIsItemAlreadyCreated] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', category: 'UNKNOWN' });
    const [newItemStockQtt, setNewItemStockQtt] = useState(0);
    const [newItemStockExpirationDate, setNewItemStockExpirationDate] = useState(null);

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
                console.log(JSON.parse(data)[0]);
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

    /*
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
    */

    const endInventory = () => {
        console.log('End Inventory');
        let closeDate = inventoryOngoing.expectedClosingDate;
        if (closeDate === null) {
            closeDate = new Date().toISOString();
        }
        let inventoryId = inventoryOngoing.id;
        fetch(`${API_URL}/inventories/${inventoryId}/close`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
            },
            body: JSON.stringify(closeDate),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to close inventory');
                }
                return response.json();
            })
            .then((data) => {
                setInventoryOngoing(null);
            })
            .catch((error) => console.error(error));
    };

    const handleBarcodeInput = () => {
        fetch(`${API_URL}/item/barcode/${barcodeInput}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
            }
        })
            .then((response) => {
                if (response.status === 404) {
                    setIsItemAlreadyCreated(false);
                    return;
                } else if (response.ok) {
                    setIsItemAlreadyCreated(true);
                    return response.json();
                } else {
                    throw new Error('Failed to fetch product by barcode');
                }
            })
            .then((data) => {
                if (data) {
                    setNewProduct(data);
                } else {
                    setNewProduct({ name: '', barCode: parseInt(barcodeInput), category: 'UNKNOWN' });
                }
                setNewItemStockFieldsVisible(true);
            })
            .catch((error) => console.error(error));
    };

    const addItemStock = () => {
        console.log('Add Item Stock');
        console.log(newProduct);
        console.log(newItemStockQtt);
        console.log(newItemStockExpirationDate);
        console.log(isItemAlreadyCreated)

        if (!isItemAlreadyCreated) {
            // é preciso criar o item e só depois adicionar o itemStock
            fetch(`${API_URL}/item/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
                },
                body: JSON.stringify(newProduct)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to create item');
                    }
                    return response.json();
                })
                .catch((error) => console.error(error));
        }

        console.log(inventoryOngoing.id)

        fetch(`${API_URL}/inventories/${inventoryOngoing.id}/item-stocks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
            },
            body: JSON.stringify({
                barCode: newProduct.barCode,
                expirationDate: newItemStockExpirationDate,
                quantity: newItemStockQtt
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to create item stock');
                }
                return response.json();
            })
            .then((data) => {
                setNewItemStockFieldsVisible(false);
                setNewItemStockQtt(0);
                setNewItemStockExpirationDate(null);
                setIsAddProductModalOpen(false);
                setInventoryOngoing(data);

            })
            .catch((error) => console.error(error));

    };

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
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inventoryOngoing.itemStocks
                                                .filter(product =>
                                                    product.itemProperties.item.name.toLowerCase().includes(textFilter.toLowerCase()) ||
                                                    product.itemProperties.item.category.toLowerCase().includes(textFilter.toLowerCase()) ||
                                                    product.itemProperties.item.barCode.toString().includes(textFilter)
                                                )
                                                .map((product) => (
                                                    <tr key={product.id}>
                                                        <td>{product.itemProperties.item.barCode}</td>
                                                        <td>{product.itemProperties.item.name}</td>
                                                        <td>{product.itemProperties.item.category}</td>
                                                        <td>{product.itemProperties.expirationDate}</td>
                                                        <td>{product.itemProperties.quantity * product.quantity}</td>
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
                                            <button className='btn btn-secondary' onClick={() => endInventory()} >Close Inventory</button>
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
                                <div className="modal-body p-5">
                                    <form>
                                        <div className="row mb-3">
                                            <label htmlFor="barCodeNumber" className="form-label">Bar Code Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="barCodeNumber"
                                                value={barcodeInput}
                                                onChange={(e) => setBarcodeInput(e.target.value)}
                                                style={{ width: '60%' }}
                                            />
                                            <button type="button" style={{ width: '30%' }} className="btn sw-bgcolor ms-4 mt-3" disabled={barcodeInput == ''} onClick={() => handleBarcodeInput()}>Search</button>
                                        </div>

                                        {newItemStockFieldsVisible && (
                                            <>
                                                <div className="row mb-3">
                                                    <label htmlFor="productName" className="form-label">Product Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        disabled={isItemAlreadyCreated}
                                                        id="productName"
                                                        value={newProduct.name}
                                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="row mb-3">
                                                    <label htmlFor="productCategory" className="form-label">Category</label>
                                                    <select
                                                        disabled={isItemAlreadyCreated}
                                                        className="form-control"
                                                        id="productCategory"
                                                        value={newProduct.category}
                                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                                    >
                                                        <option value="UNKNOWN">Select Category</option>
                                                        <option value="DRINKABLE">Drinks</option>
                                                        <option value="EATABLE">Food</option>
                                                        <option value="CUSTOM">Other</option>
                                                    </select>
                                                </div>
                                                <div className="row mb-3">
                                                    <label htmlFor="quantity" className="form-label">Quantity</label>
                                                    <input type="number" className="form-control" value={newItemStockQtt} onChange={(e) => setNewItemStockQtt(e.target.value)} />
                                                </div>
                                                <div className="row mb-3">
                                                    <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
                                                    <input type="date" className="form-control" value={newItemStockExpirationDate} onChange={(e) => setNewItemStockExpirationDate(e.target.value)} />
                                                </div>
                                            </>
                                        )}

                                    </form>
                                </div>
                                {newItemStockFieldsVisible && (
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setIsAddProductModalOpen(false)}>Close</button>
                                        <button
                                            type="button"
                                            className="btn sw-bgcolor"
                                            disabled={newItemStockQtt === 0 || newItemStockExpirationDate === null || newProduct.name === ''}
                                            onClick={() => addItemStock()}
                                        >
                                            Add Item
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </DashboardLayout>
    );
}
