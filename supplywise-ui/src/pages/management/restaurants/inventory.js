import React, { useEffect, useState } from 'react';

import DashboardLayout from "@/components/managementLayout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Inventory() {

    const [isInventoryOngoing, setIsInventoryOngoing] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [textFilter, setTextFilter] = useState('');
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [products, setProducts] = useState([]);


    useEffect(() => {
        let productsInit = [
            {
                barCodeNumber: '123456789012',
                id: 1,
                name: 'water',
                category: 'drinks',
                expirationDate: new Date(),
                priceByUn: 10,
                quantity: 10,
                un: 'kg',
            },
            {
                barCodeNumber: '452454545454',
                id: 2,
                name: 'bread',
                category: 'food',
                expirationDate: new Date(),
                priceByUn: 20,
                quantity: 20,
                un: 'kg',
            },
            {
                barCodeNumber: '498874545454',
                id: 3,
                name: 'pork',
                category: 'meat',
                expirationDate: new Date(),
                priceByUn: 30,
                quantity: 30,
                un: 'kg',
            },
            {
                id: 4,
                name: 'lettuce',
                category: 'vegetables',
                expirationDate: new Date(),
                barCodeNumber: '498874545123',
                priceByUn: 40,
                quantity: 40,
                un: 'kg',
            },
        ];
        productsInit.forEach(product => {
            product.totalPrice = product.priceByUn * product.quantity;
        });
        setProducts(productsInit);
    }, []);

    const startInventory = () => {
        let date = document.getElementById('date').value;
        if (date === '') {
            date = new Date().toISOString().split('T')[0];
        }
        setStartDate(date);
        setIsInventoryOngoing(true);
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
        console.log('Add New Product');
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
        setIsInventoryOngoing(false);
        setProducts([]);
    }


    return (
        <DashboardLayout>
            <div style={{ padding: '20px' }}>
                <div className="content">
                    {isInventoryOngoing ? (
                        <div className='row'>
                            <div className='col-10'>
                                <h1 className='text-center' > Inventory in Progress</h1>
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
                                                <th scope="col">Price/Un</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Unit</th>
                                                <th scope="col" className='text-end' >Total Price</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products
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
                                                        <td>{product.priceByUn}</td>
                                                        <td>{product.quantity}</td>
                                                        <td>{product.un}</td>
                                                        <td className='text-end' >{product.totalPrice} €</td>
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
                            <div className='col-2'>
                                <div className='bg-dark text-white p-3 ms-5' style={{ height: '100%', width: '125%', borderRadius: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <h4 className='mb-4'>Inventory Details</h4>
                                        <h6><span className='fw-bold'>Start Date:</span> {startDate}</h6>
                                        <h6><span className='fw-bold'>Products: </span>{products.length}</h6>
                                        <h6><span className='fw-bold'>Price: </span>{products.reduce((acc, product) => acc + product.totalPrice, 0)} €</h6>
                                    </div>
                                    <div>
                                        <button className='btn btn-success mb-2'>Import Inventory <FontAwesomeIcon  style={{width:'1rem'}} icon={faFileExcel}/> </button>
                                        <button className='btn btn-secondary' onClick={() => endInventory()} >End Inventory</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div>
                            <div>
                                <h1 className='text-center' > No Inventory Ongoing</h1>
                                <div className='mt-3' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                    <div className="form-group">
                                        <label htmlFor="date">Date</label>
                                        <input type="date" id="date" name="date" />
                                    </div>
                                    <div>
                                        <button className='btn sw-bgcolor' onClick={() => startInventory()}>Start Inventory</button>
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
