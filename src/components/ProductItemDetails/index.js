// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {BsPlusSquare} from 'react-icons/bs'
import {BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

class ProductItemDetails extends Component {
  state = {
    quantity: 1,
    isLoading: true,
    products: {},
    similarProduct: [],
    showErr: false,
    errmsg: '',
  }

  componentDidMount() {
    this.getProductDetails()
  }

  failureView(error) {
    console.log(error)
    this.setState({showErr: true, errmsg: error, isLoading: false})
  }

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const similarProducts = data.similar_products.map(eachProduct => ({
        id: eachProduct.id,
        imageUrl: eachProduct.image_url,
        title: eachProduct.title,
        style: eachProduct.style,
        price: eachProduct.price,
        description: eachProduct.description,
        brand: eachProduct.brand,
        totalReviews: eachProduct.total_reviews,
        rating: eachProduct.rating,
        availability: eachProduct.availability,
      }))
      const formattedProduct = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
      }

      this.setState({
        similarProduct: similarProducts,
        products: formattedProduct,
        isLoading: false,
      })
    } else if (data.status_code === 404) {
      this.failureView(data.error_msg)
    }
  }

  onDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }
  redirect = () => {
    const {history} = this.props
    history.replace('/products')
    this.setState({showErr: false, errmsg: ''})
  }

  render() {
    const {isLoading, products, similarProduct, quantity, showErr, errmsg} =
      this.state
    const {
      id,
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = products
    return (
      <>
        {isLoading ? (
          <div data-testid="loader">
            <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
          </div>
        ) : showErr ? (
          <div className="err">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
              alt="failure view"
              className="product"
            />
            <h1 className="error">{errmsg}</h1>
            <button className="err-button" onClick={this.redirect}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            <Header />
            <div className="product-details">
              <div className="product">
                <img src={imageUrl} alt="product" className="product-image" />
                <div className="desc-card">
                  <h1 className="title">{title}</h1>
                  <p className="product-price">Rs {price} /-</p>
                  <div className="rating-container">
                    <div className="rating-icon">
                      <p className="rating">{rating}</p>
                      <img
                        src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                        alt="star"
                        className="star-image"
                      />
                    </div>
                    <p className="review">{totalReviews} Reviews</p>
                  </div>
                  <p className="product-desc">{description}</p>
                  <p className="available">
                    <span className="avail">Available:</span> {availability}
                  </p>
                  <p className="available">
                    <span className="avail">Brand:</span> {brand}
                  </p>
                  <div className="change-quantity-container">
                    <button
                      className="change-btn"
                      data-testid="minus"
                      onClick={this.onDecrement}
                    >
                      <BsDashSquare />
                    </button>
                    <p>{quantity}</p>
                    <button
                      className="change-btn"
                      data-testid="plus"
                      onClick={this.onIncrement}
                    >
                      <BsPlusSquare />
                    </button>
                  </div>
                  <button type="button" className="button">
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
            <h1 className="sp-heading">Similar Products</h1>
            <ul className="unordered-list">
              {similarProduct.map(each => (
                <SimilarProductItem eachProduct={each} key={each.id} />
              ))}
            </ul>
          </div>
        )}
      </>
    )
  }
}
export default ProductItemDetails
