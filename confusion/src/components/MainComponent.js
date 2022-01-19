import {React, Component } from 'react';
import {Switch, Redirect, Route, withRouter} from 'react-router-dom';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponene';
import Contact from './ContactComponent';
import About from './AboutComponent';
import { connect } from 'react-redux';
import { postComment, fetchDishes, fetchComments, fetchPromos, fetchLeaders, postFeedback, loginUser, logoutUser, fetchFavorites, removeFavorite, postFavorite, fetchCart, emptyCart, addDishToCart, removeDishFromCart, fetchAllOrders, completePaymentOrder, registerUser} from '../redux/ActionCreaters';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import MyFavorites from './FavoritesComponent';
import Cart from './CartComponent';
import Orders from './OrdersComponent';

// Using this function to access all the defined property inside the function as props to Main Component
const mapStateToProps = (state) => {
  return {
    dishes : state.dishes,
    comments : state.comments,
    promotions : state.promotions,
    leaders : state.leaders,
    auth : state.auth,
    favorites : state.favorites,
    cart : state.cart,
    orders : state.orders
  };
}

const mapDispatchToProps = dispatch => ({
  postComment : (dishId,rating,comment) => dispatch(postComment(dishId,rating,comment)),
  fetchDishes : () => {dispatch(fetchDishes())},
  // reset a react redux form with a model = 'feedback'
  resetFeedbackForm : () => {dispatch(actions.reset('feedback'))},
  fetchComments : () => {dispatch(fetchComments())},
  fetchPromos : () => {dispatch(fetchPromos())},
  fetchLeaders : () => {dispatch(fetchLeaders())},
  postFeedback : (firstname,lastname,telnum,email,agree,contactType,message) => {dispatch(postFeedback(firstname,lastname,telnum,email,agree,contactType,message))},
  loginUser : (creds) => {dispatch(loginUser(creds))},
  logoutUser : () => {dispatch(logoutUser())},
  fetchFavorites : () => {dispatch(fetchFavorites())},
  removeFavorite : (dishId) => {dispatch(removeFavorite(dishId))},
  postFavorite : (dishId) => {dispatch(postFavorite(dishId))},
  fetchCart : () => {dispatch(fetchCart())},
  emptyCart : () => {dispatch(emptyCart())},
  addDishToCart : (dishId,quantity,dishName) => {dispatch(addDishToCart(dishId,quantity,dishName))},
  removeDishFromCart : (dishId) => {dispatch(removeDishFromCart(dishId))},
  fetchAllOrders : () => {dispatch(fetchAllOrders())},
  completePaymentOrder : (orderDocId,paymentId, paymentSignature) => {dispatch(completePaymentOrder(orderDocId,paymentId, paymentSignature))},
  registerUser : (userCreds) => {dispatch(registerUser(userCreds))},
});

class Main extends Component {

  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
    this.props.fetchFavorites();
    this.props.fetchCart();
    this.props.fetchAllOrders();
  }

  render() {

    const HomePage = () => {
      return (
        <Home dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]} 
          dishesLoading={this.props.dishes.isLoading}
          dishesErrMess={this.props.dishes.errMess}
          leader={this.props.leaders.leaders.filter((lead) => lead.featured)[0]}
          leaderLoading = {this.props.leaders.isLoading}
          leaderErrMess = {this.props.leaders.errMess}
          promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]} 
          promoLoading={this.props.promotions.isLoading}
          promoErrMess={this.props.promotions.errMess}
        />
      );
    }

    const DishWithId = ({match}) => {
      return(
        this.props.auth.isAuthenticated ? 
        <Dishdetail dish={this.props.dishes.dishes.filter((dish) => dish._id.toString() === match.params.dishId)[0]} 
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.dish.toString() === match.params.dishId)}
          commentErrMess={this.props.comments.errMess}
          postComment = {this.props.postComment}
          postFavorite = {this.props.postFavorite}
          auth = {this.props.auth}
          favorite={this.props.favorites.favorites != null 
            ? this.props.favorites.favorites.dishes.some((dish) => dish._id === match.params.dishId) 
            : false}
          cart = {this.props.cart.cart != null 
              ? this.props.cart.cart.items.some((item) => item.dish._id === match.params.dishId) 
              : false}
          addDishToCart = {this.props.addDishToCart}
        /> : 
        <Dishdetail dish={this.props.dishes.dishes.filter((dish) => dish._id.toString() === match.params.dishId)[0]} 
          isLoading={this.props.dishes.isLoading}
          errMess={this.props.dishes.errMess}
          comments={this.props.comments.comments.filter((comment) => comment.dish.toString() === match.params.dishId)}
          commentErrMess={this.props.comments.errMess}
          postComment = {this.props.postComment}
          postFavorite = {this.props.postFavorite}
          favorite = { false }
          cart = {false}
          auth = {this.props.auth}
          addDishToCart = {this.props.addDishToCart}
        />
      );
    }

    return (
      <div>
      <Header auth={this.props.auth} loginUser={this.props.loginUser} logoutUser={this.props.logoutUser} registerUser={this.props.registerUser}/>
      <TransitionGroup>
        <CSSTransition key={this.props.location.key} classNames="page" timeout={400}>
          <Switch location={this.props.location}>
            <Route path="/home" component={HomePage} />
            <Route exact path="/aboutus" component={()=> <About leaders={this.props.leaders.leaders} isLoading={this.props.leaders.isLoading} errMess={this.props.leaders.errMess}/>}/>
            <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes} isLoading={this.props.dishes.isLoading} errMess={this.props.dishes.errMess} favorites={this.props.favorites} />} />
            <Route path="/menu/:dishId" component={DishWithId}/>
            <Route path="/favorites" component={() => <MyFavorites favorites={this.props.favorites} auth={this.props.auth} removeFavorite={this.props.removeFavorite}/>} />
            <Route path="/cart" component={() => <Cart cart={this.props.cart} removeDishFromCart={this.props.removeDishFromCart} auth={this.props.auth} completePaymentOrder={this.props.completePaymentOrder}/>} />
            <Route path="/orders" component={() => <Orders auth={this.props.auth} orders={this.props.orders} />} />
            <Route exact path="/contactus" component={() =>  <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback} />} />
            <Redirect to="/home" />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
      <Footer />
    </div>
    );
  }
}

// Connecting Main to the redux store
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Main));

// The connect() function takes two optional arguments:
// – mapStateToProps(): called every time store state changes.
// Returns an object full of data with each field being a prop
// for the wrapped component
// – mapDispatchToProps(): receives the dispatch() method and
// should return an object full of functions that use dispatch()

