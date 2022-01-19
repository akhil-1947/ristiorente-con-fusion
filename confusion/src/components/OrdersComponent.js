import React from 'react';
import { Link } from 'react-router-dom';
import {Breadcrumb, BreadcrumbItem,Card,CardBody, CardHeader, CardTitle, Media} from 'reactstrap';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';


function Orders(props) {
    if(props.orders.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Orders</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>My Orders</h3>
                    </div>
                </div>
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.orders.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Orders</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>My Orders</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mb-4 mt-2">
                        {props.orders.errMess  === "Error: 401"
                            ? "Error : 401 Unauthorized. You cannot access this while being logged out. Login now to access!"
                            : props.orders.errMess}
                    </div>
                </div>
            </div>
        );
    }
    else if (props.orders.orders && props.orders.orders.length > 0) {
        const ordersList = props.orders.orders.map((order) => {
            return (
                <div key={order._id} className="col-12 col-md-6">
                    <RenderOrderCard order={order} />
                </div>
            );
        });
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Orders</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12 mb-4">
                        <h3>My Orders</h3>
                    </div>
                </div>
                <div className="row">
                    {ordersList}
                </div>
            </div>
        );
    }
    else {
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Orders</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>My Orders</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mt-2 mb-4">
                        You have no orders history! {<Link to="/cart">Checkout</Link>} now to get started!
                    </div>
                </div>
            </div>
        );
    }
}

function RenderOrderCard({order}) {
    const dishes = order.cart.map((dish) => {
        return (
            <Media tag="li" key={dish._id}>
                <Media left className="mr-4">
                    <Media object src={baseUrl+dish.dish.image} alt={dish.dish.name}></Media>
                </Media>
                <Media body>
                    <Media heading>{dish.dish.name}</Media>
                    {"Quantity : " + dish.quantity}
                </Media>
            </Media>
        );
    });
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {"Order Id : " + order.orderId}
                </CardTitle>
            </CardHeader>
            <CardBody>
                <span className="text-primary">Payment Id : </span>{order.paymentId}
                <br></br>
                <span className="text-primary">Order Placed : </span>{new Date(Date.parse(order.createdAt)).toDateString() + ' at ' + new Date(Date.parse(order.createdAt)).toLocaleTimeString()}
            </CardBody>
            <Media list>
                <h5 className="text-primary mb-4">Order Summary</h5>
                {dishes}
                <h5 className="text-primary mt-4">Total Amount = $ {order.amount/100}</h5>
            </Media>
        </Card>
    );
}

export default Orders;