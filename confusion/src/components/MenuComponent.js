import React from 'react';
import {Card, CardImg, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem} from 'reactstrap';
import {Link} from 'react-router-dom';
import Loading from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

    // We don't need to use constructor to use props
    // We only need constructor if we want to maintain state

function MenuComponentDishItem({dish,favorite}) {
    return (
        <Card key={dish.id}>
            <Link to={`/menu/${dish._id}`}>
                <CardImg width="100%" src={baseUrl+dish.image} alt={dish.label} />
                <CardImgOverlay>
                    <CardTitle>{dish.name}</CardTitle>
                </CardImgOverlay>
            </Link>
        </Card>
    );
}

const Menu = (props) => {
    const menu = props.dishes.dishes.map((dish) => {
        return (
            <div className="col-12 col-md-5 mr-1 mt-1 mb-1" key={dish._id}>
                <MenuComponentDishItem dish={dish} favorite={props.favorites.favorites != null 
                    ? props.favorites.favorites.dishes.some((qDish) => qDish._id === dish._id) 
                    : false}/>
            </div>
        );
    });
    if(props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h4>{props.errMess}</h4>
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
                        <BreadcrumbItem active>Menu</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>Menu</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    {menu}
                </div>
            </div>
        );
    }
}

export default Menu;