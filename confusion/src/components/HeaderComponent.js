import React, {Component} from 'react';
import {Navbar,NavbarBrand,NavItem,NavbarToggler,Nav,Collapse,Jumbotron, Modal, Button, ModalBody, ModalHeader,
    Form, FormGroup, Input, Label} from 'reactstrap';
import {NavLink} from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isNavOpen : false,
            isModalOpen : false,
            registerModalOpen : false,
        };
        this.toggleNav = this.toggleNav.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    toggleNav() {
        this.setState({
            isNavOpen : !this.state.isNavOpen,
        })
    }

    toggleModal() {
        this.setState({
            isModalOpen : !this.state.isModalOpen,
        })
    }

    toggleRegisterModal() {
        this.setState({
            registerModalOpen : !this.state.registerModalOpen,
        });
    }

    handleLogout() {
        this.props.logoutUser();
    }

    handleLogin(event) {
        this.props.loginUser({username : this.username.value,  password : this.password.value });
        this.toggleModal();
        event.preventDefault();
    }

    handleRegister(event) {
        if(this.passwordRegister.value === this.confirmPasswordRegister.value) {
            this.props.registerUser({
                username : this.usernameRegister.value,
                password : this.passwordRegister.value,
                firstname : this.firstnameRegister.value,
                lastname : this.lastnameRegister.value
            });
            this.toggleRegisterModal();
            event.preventDefault();
        }
        else {
            alert('Error : Password and Confirm Password must match!');
            event.preventDefault();
        }
    }

    render() {
        return(
            <React.Fragment>
                <Navbar dark expand="lg">
                    <div className="container">
                        <NavbarToggler onClick={this.toggleNav} />
                        <NavbarBrand href="/">
                            <img src={baseUrl+'images/logo.png'} height="30" width="41" alt="Ristorente con Fusion"></img>
                        </NavbarBrand>
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link" to='/home'>
                                        <span className="fa fa-home fa-lg"></span> Home
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/aboutus'>
                                        <span className="fa fa-info fa-lg"></span> About Us
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/menu'>
                                        <span className="fa fa-list fa-lg"></span> Menu
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/favorites'>
                                        <span className="fa fa-heart fa-lg"></span> Favorites
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/cart'>
                                        <span className="fa fa-shopping-cart fa-lg"></span> Cart
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/orders'>
                                        <span className="fa fa-shopping-bag fa-lg"></span> Orders
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link" to='/contactus'>
                                        <span className="fa fa-address-card fa-lg"></span> Contact Us
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <Nav className="ml-auto"  navbar>
                                <NavItem className="mt-auto mb-auto mr-2 text-white">
                                    {this.props.auth.isAuthenticated ? this.props.auth.user.username : ''}
                                </NavItem>
                                <NavItem>
                                    <Button type="button" color="#25502e" onClick={this.props.auth.isAuthenticated ? this.handleLogout : this.toggleModal}>
                                        <span className="fa fa-sign-in fa-lg"></span> {this.props.auth.isAuthenticated ? 'Logout' : 'Login'}
                                    </Button>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>
                <Jumbotron>
                    <div className="container">
                        <div className="row row-header">
                            <div className="col-12 col-sm-6">
                                <h1>Ristorente con Fusion</h1>
                                <p>We take inspiration from the World's best cuisines, and create a unique fusion experience. Our lipsmacking creations will tickle your culinary senses!</p>
                            </div>
                        </div>
                    </div>
                </Jumbotron>

                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>
                        Login
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" name="username" type="text" innerRef={(input) => this.username = input}/>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" innerRef={(input) => this.password = input} />
                            </FormGroup>
                            <FormGroup check className="mb-2">
                                <Label check>
                                    <Input id="remember" name="remember" type="checkbox" innerRef={(input) => this.remember = input}/>
                                    Remember me
                                </Label>
                            </FormGroup>
                            <Button type="submit" value="submit" color="primary">Login</Button>
                            <Button outline type="button" className="ml-2" onClick={() => {
                                this.toggleModal();
                                this.toggleRegisterModal();
                            }}>Don't have an account yet? Register now</Button>
                        </Form>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.registerModalOpen} toggle={this.toggleRegisterModal}>
                    <ModalHeader toggle={this.toggleRegisterModal}>
                        Register
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleRegister}>
                            <FormGroup>
                                <Label htmlFor="usernameRegister">Username</Label>
                                <Input id="usernameRegister" name="usernameRegister" type="text" innerRef={(input) => this.usernameRegister = input}/>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="passwordRegister">Password</Label>
                                <Input id="passwordRegister" name="passwordRegister" type="password" innerRef={(input) => this.passwordRegister = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="confirmPasswordRegister">Confirm Password</Label>
                                <Input id="confirmPasswordRegister" name="confirmPasswordRegister" type="password" innerRef={(input) => this.confirmPasswordRegister = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="firstnameRegister">Firstname</Label>
                                <Input id="firstnameRegister" name="firstnameRegister" type="text" innerRef={(input) => this.firstnameRegister = input}/>
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="lastnameRegister">Lastname</Label>
                                <Input id="lastnameRegister" name="lastnameRegister" type="text" innerRef={(input) => this.lastnameRegister = input} />
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input id="rememberRegister" name="rememberRegister" type="checkbox" innerRef={(input) => this.rememberRegister = input}/>
                                    Remember me
                                </Label>
                            </FormGroup>
                            <Button type="submit" value="submit" color="primary">Register</Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </React.Fragment>
        );
    }
}

export default Header;