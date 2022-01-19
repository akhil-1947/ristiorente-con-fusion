import React, { Component} from "react";
import {Card, CardBody, CardImg, CardTitle, CardText, Breadcrumb ,BreadcrumbItem, Button, 
    Modal, ModalHeader, ModalBody, Row, Label, Col, CardFooter} from 'reactstrap';
import {Link} from 'react-router-dom';
import { LocalForm, Control  } from "react-redux-form";
import Loading from "./LoadingComponent";
import {baseUrl} from '../shared/baseUrl';
import { Fade, FadeTransform, Stagger } from 'react-animation-components';
import StarRatings from 'react-star-ratings';


class DishItemCard extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalOpen : false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            modalOpen : !this.state.modalOpen,
        })
    }

    handleFormSubmit(values) {
        this.toggleModal();
        if(!isNaN(values.quantity)) {
            return this.props.addDishToCart(this.props.dish._id,parseInt(values.quantity.toString()),this.props.dish.name);
        }
        else {
            return this.props.addDishToCart(this.props.dish._id,1);
        }
    }

    render() {
        var rating = 0;
        this.props.comments.forEach((comment) => {
            rating = rating + comment.rating;
        });
        return (
            <div className="col-12 col-md-5 m-1">
                <FadeTransform in 
                    transformProps = {{
                        exitTransform : 'scale(0.5) translateY(-50%)'
                    }}>
                    <Card>
                        <CardImg src={baseUrl+ this.props.dish.image}></CardImg>
                        <CardBody>
                            <CardTitle>{this.props.dish.name} <CommentRating rating={rating > 0 ? (rating/this.props.comments.length) : 5}/></CardTitle>
                            <CardText>{this.props.dish.description}</CardText>
                        </CardBody>
                        <CardFooter>
                            <Button outline color="primary mr-2" onClick={() => {
                                    if(this.props.auth.isAuthenticated) {
                                        if(this.props.favorite) {
                                            alert("This dish had been already added to your favorites!");
                                        }
                                        else {
                                            return this.props.postFavorite(this.props.dish._id);
                                        }
                                    }
                                    else {
                                        alert('Error : You must be logged in to add dishes to your favorite!');
                                    }
                                }}><span className={this.props.favorite ? "fa fa-heart" : "fa fa-heart-o"}></span></Button>

                            <Button outline color="primary" onClick={() => {
                                    if(this.props.auth.isAuthenticated){
                                        if(this.props.cart) {
                                            alert("This dish had been already added to your cart!");
                                        }
                                        else {
                                            return this.toggleModal();
                                        }
                                    }
                                    else {
                                        alert('Error : You must be logged in to add dishes to your cart!');
                                    }
                                }}><span className={this.props.cart ? "fa fa-shopping-cart" : "fa fa-cart-plus"}>{this.props.cart ? " Added to Cart" : " Add to Cart"}</span></Button>
                        </CardFooter>
                        <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal}>
                            <ModalHeader toggle={this.toggleModal}>Select Quantity</ModalHeader>
                            <ModalBody>
                                <LocalForm onSubmit={(valuse) => this.handleFormSubmit(valuse) }>
                                    <Row className="form-group">
                                        <Col>
                                            <Label for="quantity">Add Quantity</Label>
                                            <Control name="quantity" model=".quantity" id="quantity" type="num" component="input" className="form-control"></Control>
                                        </Col>
                                    </Row>
                                    <Row className="form-group">
                                        <Col>
                                            <Button role="submit" className="btn btn-primary">Add to Cart</Button>
                                        </Col>
                                    </Row>
                                </LocalForm>
                            </ModalBody>
                        </Modal>
                    </Card>
                </FadeTransform>
            </div>
        );
    }
}

class CommentRating extends Component {
    render() {
      return (
        <div>
            {/* <p className="text-primary bg-comment">{this.props.comment}</p> */}
            <StarRatings rating={this.props.rating} starRatedColor="rgb(255, 149, 41)" numberOfStars={5} starDimension="25px"></StarRatings>
        </div>
      );
    }
}


function RenderComments({comments,postComment,dishId,auth}) {
    var averageRating = 0;
    if(comments != null) {
        return (
            <div className="col-12 col-md-5 m-1">
                <h4>Comments</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {comments.map((comment) => {
                            averageRating = averageRating + comment.rating;
                            return (
                                <Fade in key={comment._id}>
                                    {/* <CommentRating rating={comment.rating} comment={comment.comment}/> */}
                                    <li key={comment._id}>
                                        <p className="text-primary bg-comment">{comment.comment}</p>
                                        <p className="text-secondary">-- {comment.author.username}, {new Date(Date.parse(comment.createdAt)).toDateString() + ' at ' + new Date(Date.parse(comment.createdAt)).toLocaleTimeString()}</p>
                                    </li>
                                </Fade>
                            );
                        })}
                    </Stagger>
                </ul>
                <CommentForm dishId={dishId} postComment={postComment} auth={auth}/>
            </div>
        );
    } else {
        return(
            <div></div>
        );
    }
}

class CommentForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen : false,
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen : !this.state.isModalOpen,
        })
    }

    handleCommentSubmit(values) {
        console.log("Form submitted " + JSON.stringify(values));
        this.toggleModal();
        // to initiate the action upon the user submitting the comment form
        this.props.postComment(this.props.dishId,values.rating != null ? values.rating : 5,values.comment);
        // alert("Form submitted " + JSON.stringify(values));
    }

    render() {
        return (
             <div className="container mb-4">
                 <Button outline role="button" onClick={() => {
                     if(this.props.auth.isAuthenticated) {
                        return this.toggleModal();
                     }
                     else {
                        alert('Error : You must be logged in to add comments!');
                     }
                 }}>
                    <span className="fa fa-edit f-lg"></span> Add Comment
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Add Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleCommentSubmit(values)}>
                            <Row className="form-group">
                                <Col>
                                    <Label for="rating">Rating</Label>
                                    <Control className="form-control" model=".rating" name="rating" 
                                        id="rating" component="select">
                                        <option>Select Rating</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label for="rating">Comment</Label>
                                    <Control className="form-control" model=".comment" name="comment"
                                        id="comment" rows="6" component="textarea" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Button role="submit" color="primary">Submit</Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
             </div>
        );
    }
}

// 2nd way of defining functional components
const Dishdetail = (props) => {
    if(props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 align-self-center">
                        <Loading />
                    </div>
               </div>
            </div>
        );
    }
    else if(props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 align-self-center">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
    else if(props.dish != null) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <DishItemCard dish={props.dish} favorite={props.favorite} postFavorite={props.postFavorite} auth={props.auth} cart={props.cart} addDishToCart={props.addDishToCart} comments={props.comments}/>
                    <RenderComments comments={props.comments} postComment={props.postComment} dishId={props.dish._id} auth={props.auth}/>
                </div>
            </div>
       );
    } else {
        return (
            <div></div>
        );
    }
}

export default Dishdetail;