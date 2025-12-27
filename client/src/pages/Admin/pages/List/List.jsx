import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from "react-toastify"
import { FaEdit, FaTrash } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'

const List = ({ url }) => {

    const navigate = useNavigate();
    const [list, setList] = useState([]);

    const fetchList = async () => {
        const response = await axios.get(`${url}/api/food/list`);
        if (response.data.success) {
            setList(response.data.data)
        }
        else {
            toast.error("Error")
        }
    }

    const removeFood = async (foodId) => {
        const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
        await fetchList();
        if (response.data.success) {
            toast.success(response.data.message)
        }
        else {
            toast.error("Error");
        }
    }

    useEffect(() => {
        fetchList();
    }, [])

    return (
        <div className='list add flex-col'>
            <p>All Foods List</p>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                {list.map((item, index) => {
                    return (
                        <div key={index} className='list-table-format'>
                            <img src={`${url}/images/` + item.image} alt="" />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>₹{item.price}</p>
                            <div className='list-actions'>
                                <FaEdit onClick={() => navigate(`/admin/edit/${item._id}`)} className='cursor edit-icon' />
                                <FaTrash onClick={() => removeFood(item._id)} className='cursor delete-icon' />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default List
