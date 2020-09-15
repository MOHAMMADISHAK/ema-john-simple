import React, { useState } from 'react';
import fakeData from '../../fakeData';
import "./Shop.css"
import Product from '../Product/Product';
import Item from '../Item/Item';
import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Shop = () => {
    const first10 = fakeData.slice(0,10);
    const [products,setProducts] = useState(first10);
    const [cart,setCart] = useState([]);

   useEffect(()=>{
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);

        const previousCart = productKeys.map(existingKey =>{
            const product = fakeData.find(pd=>pd.key === existingKey);
            product.quantity = savedCart[existingKey];
            return product;
        });
        setCart(previousCart);
    },[])


    const handleAddProduct = (product)=>{
        // console.log("product added",product);
        const toBeAdded = product.key;
        const sameProduct = cart.find(pd=>pd.key === toBeAdded);
        let count = 1;
        let newCart;
        if(sameProduct){
            count = sameProduct.quantity + 1;
            sameProduct.quantity = count;
            const others = cart.filter(pd=>pd.key !== toBeAdded);
            newCart = [...others,sameProduct];
        
        }
        else{
            product.quantity=1;
            newCart = [...cart,product];
        }
   
        setCart(newCart);
        // const sameProduct = newCart.filter(pd=>pd.key === product.key);
        // const count = sameProduct.length;
        addToDatabaseCart(product.key,count)
    }

    return (
        <div className="twin-container">
            <div className="product-container">
               
                    {
                        products.map(pd=> <Product 
                            key = {pd.key}
                            showAddToCart = {true} 
                            handleAddProduct={handleAddProduct}
                            product={pd}>

                            </Product>)
                    }
             
            </div>
            <div className="cart-container">
                   <Item cart={cart}>
                   <Link to="/review">
                         <button className="main-button">Review Order</button>
                    </Link>
                   </Item>
            </div>
        </div>
    );
};

export default Shop;