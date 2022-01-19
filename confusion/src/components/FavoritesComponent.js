import React from 'react';
import {Breadcrumb, BreadcrumbItem, Media, Button } from "reactstrap";
import { baseUrl } from '../shared/baseUrl';
import Loading from "./LoadingComponent";
import { Stagger, Fade } from 'react-animation-components';
import { Link } from 'react-router-dom';

const MyFavorites = (props) => {
    if(props.favorites.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Favorites</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>My Favorite Dishes</h3>
                    </div>
                </div>
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    } 
    else if (props.favorites.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Favorites</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>My Favorite Dishes</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mb-4 mt-2">
                        {props.favorites.errMess  === "Error: 401"
                            ? "Error : 401 Unauthorized. You cannot access this while being logged out. Login now to access!"
                            : props.favorites.errMess}
                    </div>
                </div>
            </div>
        );
    }
    else if (props.favorites.favorites && props.favorites.favorites.dishes.length > 0) {
        const favList = props.favorites.favorites.dishes.map((favDish) => {
            return (
                <Fade in key={favDish._id}>
                    <RenderDish dish={favDish} removeFavorite={props.removeFavorite}/>
                </Fade>
            );
        });
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Favorites</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12 mb-4">
                        <h3>My Favorite Dishes</h3>
                    </div>
                    <div className="col-12">
                        {props.auth.isAuthenticated 
                            ?   <Media list>
                                    <Stagger in>
                                        {favList}
                                    </Stagger>
                                </Media>
                            :   "You are not logged in! Login now to access your favorite dishes"}
                    </div>
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
                        <BreadcrumbItem active>Favorites</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>My Favorites Dishes</h3>
                    </div>
                    <div className="col-12 mt-4 mb-4">
                        You have no favorite dishes! Add some {<Link to="/menu">dishes</Link>} to your favorite collection.
                    </div>
                </div>
            </div>
        );
    }
}

function RenderDish({dish,removeFavorite}) {
    return (
        <Media tag="li" className="mb-4" key={dish._id}>
            <Media left middle className="mr-4">
                <Media object src={baseUrl + dish.image} alt={dish.name}></Media>
            </Media>
            <Media body>
                <Media heading>{dish.name}</Media>
                {dish.description}
            </Media>
            <Button className="btn btn-danger mt-auto mb-auto ml-2" onClick={() => removeFavorite(dish._id)}><span className="fa fa-times"></span></Button>
        </Media>
    );
}

export default MyFavorites;