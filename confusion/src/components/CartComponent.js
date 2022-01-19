import React from 'react';
import { Link } from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem, Button, Card, CardHeader, CardImg, CardBody, CardTitle, CardFooter} from 'reactstrap';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';

function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      }
      script.onerror = () => {
        resolve(false);
      }
      document.body.appendChild(script);
    });
  }
  
  async function displayRazorpay(completePaymentOrder) {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if(!res) {
        alert('Razorpay checkout SDK failed to load. Please check your internet connection');
      }
      const bearer = 'bearer ' + localStorage.getItem('token');
      fetch(baseUrl+'orders/createOrder',{
          method : 'POST',
          headers : {
              'Authorization' : bearer,
          }
      })
      .then((response) => {
          if(response.ok) {
              return response;
          }
          else {
              var err = new Error('Error: '+response.status);
              err.response = response;
              throw err;
          }
      },err => {throw(err)})
      .then((response) => response.json())
      .then((response) => {
        const options = {
            key: 'rzp_test_XGENogoPB0Rsw4',
            order_id: response.response.orderId,
            name: 'Ristorento con Fusion',
            description: 'Payment portal for ordering food items from Ristorento con Fusion',
            image: baseUrl+'images/logo.png',
            handler: function (resp) {
                completePaymentOrder(response.response._id,resp.razorpay_payment_id,resp.razorpay_signature);
                alert('Your order has been placed successfully! Do check out the orders page for more details!');
                return true;
            },
            prefill: {
                name : localStorage.getItem('username'),
            }
        }
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      })
      .catch((err) => alert(err.message));
  }

const Cart = (props) => {
    if(props.cart.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Cart</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>My Cart</h3>
                    </div>
                </div>
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.cart.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Cart</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>My Cart</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mb-4 mt-2">
                        {props.cart.errMess  === "Error: 401"
                            ? "Error : 401 Unauthorized. You cannot access this while being logged out. Login now to access!"
                            : props.cart.errMess}
                    </div>
                </div>
            </div>
        );
    }
    else if (props.cart.cart && props.cart.cart.items.length > 0) {
        const dishes = props.cart.cart.items.map((item) => {
            return (
                <div key={item.dish._id} className="col-12 col-md-4">
                    <RenderCartProd dish={item.dish} quantity={item.quantity} removeDishFromCart={props.removeDishFromCart} />
                </div>
            );
        });
        const dishesName = props.cart.cart.items.map((item) => {
            return (
                <p key={item.dish._id}>{item.dish.name} : $ {item.dish.price*item.quantity/100}</p>
            );
        });
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Cart</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>My Cart</h3>
                    </div>
                </div>
                <div className="row">
                    {dishes}
                </div>
                <div className="row">
                    <div className="col-12 col-md-6 mb-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Checkout Details</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <h6 className="text-secondary">Order Details</h6>
                                {dishesName}
                                <span className="text-primary">
                                    {"Total Amount : $ " + props.cart.cart.totalAmount/100}
                                </span>
                            </CardBody>
                            <CardFooter>
                                <Button onClick={() => displayRazorpay(props.completePaymentOrder)} className="btn btn-primary">Checkout</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Cart</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>My Cart</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mt-2 mb-4">
                        You have no dishes in the cart! Add some {<Link to="/menu">dishes</Link>} to your cart.
                    </div>
                </div>
            </div>
        );
    }
}

function RenderCartProd({dish,quantity,removeDishFromCart}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {dish.name}
                    <Button outline color="danger ml-4" onClick={() => removeDishFromCart(dish._id)}><span className="fa fa-times"></span></Button>
                </CardTitle>
            </CardHeader>
            <CardImg src={baseUrl+dish.image} alt={dish.name} width="100%"></CardImg>
            <CardBody>
                {"Quantity : " + quantity}
                <br></br>
                {"Price : $ " +dish.price/100 + ' per dish'}
            </CardBody>
        </Card>
    );
}

export default Cart;