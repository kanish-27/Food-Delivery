import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {

    const { food_list } = useContext(StoreContext)
    const [visibleCount, setVisibleCount] = React.useState(4)

    React.useEffect(() => {
        setVisibleCount(4)
    }, [category])

    const filteredItems = food_list.filter(item => category === "All" || category === item.category);
    const displayItems = filteredItems.slice(0, visibleCount);

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {displayItems.map((item, index) => {
                    return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
                })}
            </div>
            {visibleCount < filteredItems.length && (
                <div className="view-more-container">
                    <button onClick={() => setVisibleCount(prev => prev + 4)}>View More</button>
                </div>
            )}
        </div>
    )
}

export default FoodDisplay
