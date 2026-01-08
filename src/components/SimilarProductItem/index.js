// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props
  const {
    imageUrl,
    title,
    style,
    price,
    description,
    brand,
    totalReviews,
    rating,
    availability,
  } = eachProduct
  return (
    <li className="list-item">
      <img src={imageUrl} alt="similar product" className="sp-image" />
      <p className="sp-name">{title}</p>
      <p className="sp-brand">by {brand}</p>
      <div className="sub-container">
        <p className="sp-price">Rs {price}/-</p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-image"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
