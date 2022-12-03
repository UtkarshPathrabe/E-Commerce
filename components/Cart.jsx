import React, { useEffect } from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import toast from 'react-hot-toast';

import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';

const Cart = () => {
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuantity, onRemove } = useStateContext();

  const handleClickOutside = (event) => {
    if (event.target.className === 'cart-wrapper') {
      setShowCart(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleCheckout = async () => {
    const stripe = await getStripe();
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    });
    if (response.statusCode === 500) {
      return;
    }
    const data = await response.json();
    if (data) {
      toast.loading('Redirecting...');
      stripe.redirectToCheckout({ sessionId: data.id });
    }
  };

  return (
    <div className='cart-wrapper'>
      <div className='cart-container'>
        <button type='button' className='cart-heading' onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
          <span className='heading'>Your Cart</span>
          <span className='cart-num-items'>({ totalQuantities } items)</span>
        </button>
        { (cartItems.length < 1) ? (
          <div className='empty-cart'>
            <AiOutlineShopping size={ 150 } />
            <h3>Your shopping bag is empty</h3>
            <Link href='/'>
              <button type="button" onClick={() => setShowCart(false)} className='btn'>
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (<>
          <div className='product-container'>
            { cartItems.map((item, index) => (
              <div className='product' key={ item._id }>
                <img src={ urlFor(item?.image[0]) } className='cart-product-image' />
                <div className='item-desc'>
                  <div className='flex top'>
                    <h5>
                      { item.name }
                    </h5>
                    <h4>&#8377; {item.price}</h4>
                  </div>
                  <div className='flex bottom'>
                    <div>
                      <p className='quantity-desc'>
                        <span className='minus' onClick={() => { toggleCartItemQuantity(item, 'dec') }}><AiOutlineMinus /></span>
                        <span className='num'>{ item.quantity }</span>
                        <span className='plus' onClick={() => { toggleCartItemQuantity(item, 'inc') }}><AiOutlinePlus /></span>
                      </p>
                    </div>
                    <button type='button' className='remove-item' onClick={() => { onRemove(item) }}>
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            )) }
          </div>
          <div className='cart-bottom'>
            <div className='total'>
              <h3>Subtotal:</h3>
              <h3>&#8377; {totalPrice}</h3>
            </div>
            <div className='btn-container'>
              <button type='button' onClick={handleCheckout} className='btn'>
                Pay with Stripe
              </button>
            </div>
            <div style={ { display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
              <span>This is a test site. Please do not use real card info for payment.</span>
            </div>
          </div>
          </>
        ) }
      </div>
    </div>
  );
};

export default Cart;
