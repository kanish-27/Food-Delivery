import React, { useEffect, useState } from 'react'
import './Edit.css'
import axios from "axios"
import { toast } from 'react-toastify'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'

const Edit = ({ url }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // We store the existing image URL to show if no new image is selected
    const [image, setImage] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad"
    })

    // Fetch existing data
    useEffect(() => {
        const fetchFood = async () => {
            try {
                // Actually we don't have a single item fetch API yet in the frontend usage list,
                // but we can fetch all and find, OR better, create/use a 'getById' endpoint??
                // Looking at foodController, we don't have getById exposed. 
                // However, we can use the list and find locally for now or just fetch all.
                // Fetching all is inefficient but works for small app.
                // Let's rely on list, but wait, 'listFood' is all we have.
                // Ideally we should add 'getById' to backend, but let's stick to simple first:
                // Fetch all and find.

                const response = await axios.get(`${url}/api/food/list`);
                if (response.data.success) {
                    const food = response.data.data.find(item => item._id === id);
                    if (food) {
                        setData({
                            name: food.name,
                            description: food.description,
                            price: food.price,
                            category: food.category
                        });
                        setPreviewImage(`${url}/images/${food.image}`);
                    } else {
                        toast.error("Food item not found");
                        navigate('/admin/list');
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error("Error fetching food details");
            }
        };
        fetchFood();
    }, [id, url, navigate]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("id", id);
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", Number(data.price))
        formData.append("category", data.category)

        if (image) {
            formData.append("image", image)
        }

        const response = await axios.post(`${url}/api/food/update`, formData);
        if (response.data.success) {
            toast.success(response.data.message)
            navigate('/admin/list');
        }
        else {
            toast.error(response.data.message)
        }
    }

    return (
        <div className='edit'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <h2>Edit Item</h2>
                <div className="add-img-upload flex-col">
                    <p>Upload Image (Leave empty to keep current)</p>
                    <label htmlFor="image">
                        {image
                            ? <img src={URL.createObjectURL(image)} alt="" />
                            : (previewImage ? <img src={previewImage} alt="" /> : <div style={{ fontSize: 50, cursor: 'pointer' }}><FaCloudUploadAlt color='white' /></div>)
                        }
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                </div>
                <div className="add-product-name flex-col">
                    <p>Product name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
                </div>
                <div className="add-product-description flex-col">
                    <p>Product description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select onChange={onChangeHandler} name="category" value={data.category}>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product price</p>
                        <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='$20' />
                    </div>
                </div>
                <button type='submit' className='add-btn'>UPDATE</button>
            </form>
        </div>
    )
}

export default Edit
