import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDatabaseCart, removeFromDatabaseCart, processOrder } from '../../utilities/databaseManager';
import fakeData from '../../fakeData';
import ReviewItem from '../ReviewItem/ReviewItem';
import Item from '../Item/Item';
import happy from '../../images/giphy.gif'
import { useHistory } from 'react-router-dom';

const Review = () => {
    const [cart,setCart] = useState([]);
    const [orderPlaced,setOrderPlaced] = useState([]);
    const history =useHistory();

    const handleProceedCheckout = ()=>{
        // setCart([]);
        // setOrderPlaced(true);
        // processOrder();

        history.push('/shipment');
    }

    const removeProduct = (productKey)=>{
        const newCart = cart.filter(pd => pd.key !== productKey)
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }

    useEffect(()=>{
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);

        const cartProducts = productKeys.map(key =>{
            const product = fakeData.find(pd=>pd.key === key);
            product.quantity = savedCart[key];
            return product;
        });
        setCart(cartProducts);
    },[])

    let thankYou ;

    if(orderPlaced){
        thankYou = <img src={happy} alt=""></img>
    }

    return (
        <div className="twin-container">
           
          <div className="product-container">
          {
                cart.map(pd=><ReviewItem 
                    key={pd.key}  
                    removeProduct={removeProduct}
                    product={pd}></ReviewItem>)
            }        
          </div>
          <div className="cart-container">
                <Item cart={cart}>
                    <button onClick={handleProceedCheckout} className="main-button">Proceed Checkout</button>
                </Item>
          </div>
        </div>
    );
};

export default Review;