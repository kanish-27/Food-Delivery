import React, { useContext } from 'react'
import './FoodItem.css'
import { StoreContext } from '../../context/StoreContext'
import { FaPlus, FaMinus } from 'react-icons/fa'

const FoodItem = ({ id, name, price, description, image }) => {

    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    return (
        <div className='food-item'>
            <div className="food-item-image-container">
                <img className='food-item-image' src={url + "/images/" + image} alt="" />
                {!cartItems[id]
                    ? <div className='food-item-add' onClick={() => addToCart(id)}><FaPlus /></div>
                    : <div className='food-item-counter'>
                        <div onClick={() => removeFromCart(id)} className='food-item-counter-remove'><FaMinus /></div>
                        <p style={{ color: 'black' }}>{cartItems[id]}</p>
                        <div onClick={() => addToCart(id)} className='food-item-counter-add'><FaPlus /></div>
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">₹{price}</p>
            </div>
        </div>
    )
}

export default FoodItem
